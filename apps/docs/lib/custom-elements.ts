import { build } from "esbuild"
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import ts from "typescript"
import { cssVariableTable } from "./css-variables"
import { dataAttributeTables } from "./data-attributes"
import type { Definition } from "./element-definitions"
import { pageMarkdown } from "./page-markdown"
import { docPage, docPages } from "./pages"
import { repoRoot } from "./repo-root"

// The custom elements manifest `@ui-sdk/web` ships, and the HTML custom data
// VS Code reads, so editors and agents see every tag with its attributes,
// properties, events and styling hooks. The elements come from running the
// entries' own define calls, and the descriptions and types from the core's
// JSDoc and the element types, so neither can drift from what ships.
// Format: https://github.com/webcomponents/custom-elements-manifest

const web = path.join(repoRoot, "packages/web/src")
const recorder = path.join(repoRoot, "apps/docs/lib/element-definitions.ts")

type Located = Definition & { file: string; line: number; column: number }

// Runs every entry with `define-element` swapped for a recorder, the way an
// import defines its elements in a browser. Source maps put each call back in
// its source file.
async function recordDefinitions(entries: string[]) {
  const out = mkdtempSync(path.join(repoRoot, "node_modules/.cache/elements-"))
  const sourceMaps = process.sourceMapsEnabled
  try {
    await build({
      stdin: {
        contents: [
          `export { definitions } from ${JSON.stringify(recorder)}`,
          ...entries.map(
            (entry) =>
              `import ${JSON.stringify(path.join(web, "entries", `${entry}.ts`))}`
          ),
        ].join("\n"),
        resolveDir: repoRoot,
        loader: "ts",
      },
      outfile: path.join(out, "definitions.mjs"),
      bundle: true,
      platform: "node",
      format: "esm",
      sourcemap: "inline",
      logLevel: "warning",
      plugins: [
        {
          name: "record-definitions",
          setup(build) {
            build.onResolve({ filter: /define-element$/ }, (args) =>
              args.importer === recorder ? undefined : { path: recorder }
            )
            // Each entry first names itself, so its definitions are credited to it.
            build.onLoad({ filter: /\/entries\/[\w-]+\.ts$/ }, (args) => ({
              contents: `import "begin:${path.basename(args.path, ".ts")}"\n${readFileSync(args.path, "utf8")}`,
              loader: "ts",
            }))
            build.onResolve({ filter: /^begin:/ }, (args) => ({
              path: args.path.slice(6),
              namespace: "begin",
            }))
            build.onLoad({ filter: /.*/, namespace: "begin" }, (args) => ({
              contents: `import { begin } from ${JSON.stringify(recorder)}\nbegin(${JSON.stringify(args.path)})`,
              resolveDir: repoRoot,
              loader: "ts",
            }))
          },
        },
      ],
    })
    process.setSourceMapsEnabled(true)
    const { definitions } = (await import(
      pathToFileURL(path.join(out, "definitions.mjs")).href
    )) as {
      definitions: Definition[]
    }
    return definitions.map((definition) => {
      // The first frame outside the recorder is the define call.
      const frame = definition.stack
        .split("\n")
        .slice(1)
        .find((line) => !line.includes("element-definitions.ts"))
      const [, file, line, column] =
        frame?.match(/\(?([^\s(]+):(\d+):(\d+)\)?$/) ?? []
      if (!file) {
        throw new Error(`Can't find where <${definition.tagName}> is defined.`)
      }
      return { ...definition, file, line: Number(line), column: Number(column) }
    })
  } finally {
    process.setSourceMapsEnabled(sourceMaps)
    rmSync(out, { recursive: true, force: true })
  }
}

function webProgram() {
  const config = ts.getParsedCommandLineOfConfigFile(
    path.join(web, "../tsconfig.json"),
    {},
    { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} }
  )!
  const program = ts.createProgram(config.fileNames, config.options)
  return { program, checker: program.getTypeChecker() }
}

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
const pascal = (tag: string) =>
  tag.replace(/(^|-)(\w)/g, (_, __, char: string) => char.toUpperCase())
const oneLine = (text: string) => text.replace(/\s+/g, " ").trim()

/** One attribute, property or event, with its type and what it does. */
type Field = {
  name: string
  type?: string
  description?: string
  default?: string
  readonly?: boolean
}

/** A method on the element itself, like `checkValidity()`. */
type Method = {
  name: string
  description?: string
  parameters: { name: string; type: string }[]
  returns: string
}

// Every owner's own attribute and property.
const debug: Field = {
  name: "debug",
  type: "boolean",
  description:
    "Logs every change to the console, with its reason and what caused it.",
}

type ElementDoc = {
  tagName: string
  kind: Definition["kind"]
  entries: string[]
  owners: string[]
  parts: string[]
  description: string
  attributes: Field[]
  properties: Field[]
  methods: Method[]
  events: Field[]
  dataAttributes: { name: string; description?: string; values?: string[] }[]
  cssProperties: { name: string; description?: string }[]
}

/**
 * Every element `@ui-sdk/web` defines, described from its define call, the
 * core's types and the docs. `missing` lists what has no description.
 */
async function describeElements() {
  const entries = readdirSync(path.join(web, "entries"))
    .map((file) => file.replace(/\.ts$/, ""))
    .sort()
  const recorded = await recordDefinitions(entries)
  const { program, checker } = webProgram()
  const missing: string[] = []

  // The define call at a recorded place.
  function callAt({ file, line, column, tagName }: Located) {
    const source = program.getSourceFile(file)
    if (!source) {
      throw new Error(
        `<${tagName}>: ${file} isn't in the web package's program.`
      )
    }
    const position = source.getPositionOfLineAndCharacter(line - 1, column - 1)
    let found: ts.CallExpression | undefined
    const visit = (node: ts.Node) => {
      if (position < node.getStart(source) || position >= node.end) {
        return
      }
      if (ts.isCallExpression(node) && position < node.expression.end) {
        found = node
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
    if (!found) {
      throw new Error(
        `<${tagName}>: no define call at ${file}:${line}:${column}.`
      )
    }
    return found
  }

  // The comment above a statement, without the markup example that follows "Markup:".
  function commentAbove(node: ts.Node) {
    const text = node.getSourceFile().text
    const ranges = ts.getLeadingCommentRanges(text, node.getFullStart()) ?? []
    const comment = ranges
      .map((range) =>
        text
          .slice(range.pos, range.end)
          .replace(/^\/\*\*?|\*\/$/g, "")
          .split("\n")
          .map((line) => line.replace(/^\s*(\/\/|\*)\s?/, ""))
          .join("\n")
      )
      .join("\n")
    return oneLine(comment.split(/Markup:/)[0])
  }

  function statementOf(node: ts.Node) {
    let current = node
    while (
      current.parent &&
      !ts.isBlock(current.parent) &&
      !ts.isSourceFile(current.parent)
    ) {
      current = current.parent
    }
    return current
  }

  // The define call's name, like `createParts`.
  const calleeOf = (call: ts.CallExpression) => call.expression.getText()

  // What a part's element is defined with, beyond its tag: its entry in
  // `createParts(primitive, tags)`, by key, or the options of
  // `definePart(primitive, slot, options)`.
  function partOptions(call: ts.CallExpression, key: string) {
    const callee = calleeOf(call)
    if (callee === "definePart") {
      return call.arguments[2] && checker.getTypeAtLocation(call.arguments[2])
    }
    if (callee === "createParts") {
      return property(checker.getTypeAtLocation(call.arguments[1]), key)?.type
    }
  }

  // The node whose comment describes an element: its entry in
  // `createParts`' tags, by key, else its define call's statement.
  function describedNode(call: ts.CallExpression, key: string) {
    const tags = call.arguments[1]
    if (
      calleeOf(call) !== "createParts" ||
      !tags ||
      !ts.isObjectLiteralExpression(tags)
    ) {
      return statementOf(call)
    }
    return tags.properties.find(
      (entry) =>
        entry.name &&
        (ts.isIdentifier(entry.name) || ts.isStringLiteral(entry.name)) &&
        entry.name.text === key
    )
  }

  function enclosingFunction(node: ts.Node) {
    let current: ts.Node | undefined = node.parent
    while (current && !ts.isFunctionDeclaration(current)) {
      current = current.parent
    }
    return current
  }

  const property = (type: ts.Type | undefined, name: string) => {
    const symbol = type && checker.getPropertyOfType(type, name)
    return symbol
      ? { symbol, type: checker.getTypeOfSymbol(symbol) }
      : undefined
  }

  // A type as an attribute or property shows it: unions of literals spelled
  // out, without the `undefined` that optional fields add, and type
  // parameters as their defaults, like a tab's value as `string`.
  function typeText(
    type: ts.Type,
    generics: Map<string, string>,
    keep = (_: ts.Type) => true
  ) {
    const members = (type.isUnion() ? type.types : [type]).filter(
      (member) => !(member.flags & ts.TypeFlags.Undefined) && keep(member)
    )
    // TypeScript lists `null` first. It reads better last, as written.
    const text = members
      .map((member) =>
        checker.typeToString(member, undefined, ts.TypeFormatFlags.NoTruncation)
      )
      .sort((a, b) => Number(a === "null") - Number(b === "null"))
      .join(" | ")
      .replace(/\bfalse \| true\b/, "boolean")
    return text.replace(/\b[A-Z]\w*\b/g, (name) => generics.get(name) ?? name)
  }

  // What an attribute can be written as: a boolean or a number for those
  // types, a string for a list, else the option's strings, numbers and
  // booleans, without the elements and functions only a property takes.
  // `string & {}`, which keeps an option's suggestions beside any string, is
  // any string.
  function attributeType(
    parse: unknown,
    type: ts.Type,
    generics: Map<string, string>
  ) {
    if (parse === "boolean" || parse === "number") {
      return parse
    }
    if (parse === "list") {
      return "string"
    }
    const writable =
      ts.TypeFlags.StringLike |
      ts.TypeFlags.NumberLike |
      ts.TypeFlags.BooleanLike
    const text = typeText(type, generics, (member) =>
      member.isIntersection()
        ? !!(member.types[0].flags & ts.TypeFlags.String)
        : !!(member.flags & writable)
    ).replace(/\bstring & \{\}/, "string")
    return text || "string"
  }

  // Descriptions are written for every framework. Callbacks are events here,
  // and change details arrive as the event's `detail`.
  const forWeb = (text: string) =>
    text
      .replace(
        /`(on[A-Z]\w*)`/g,
        (_, name: string) => `\`${name.slice(2).toLowerCase()}\``
      )
      .replace(/`details\.cancel\(\)`/g, "`event.preventDefault()`")
      .replace(/`details\./g, "`event.detail.")

  const docsOf = (symbol: ts.Symbol) =>
    forWeb(
      oneLine(ts.displayPartsToString(symbol.getDocumentationComment(checker)))
    )

  function fieldOf(
    name: string,
    found: ReturnType<typeof property>,
    generics: Map<string, string>,
    label: string,
    // Describes it when `found` says nothing itself.
    describedBy?: ReturnType<typeof property>
  ) {
    const field: Field = { name }
    if (!found) {
      missing.push(label)
      return field
    }
    const description =
      docsOf(found.symbol) || (describedBy ? docsOf(describedBy.symbol) : "")
    if (!description) {
      missing.push(label)
    }
    const fallback = found.symbol
      .getJsDocTags(checker)
      .find((tag) => tag.name === "default" || tag.name === "defaultValue")
    field.type = typeText(found.type, generics)
    if (description) {
      field.description = description
    }
    if (fallback) {
      field.default = ts
        .displayPartsToString(fallback.text)
        .replace(/^`|`$/g, "")
    }
    return field
  }

  // The primitive an owner defines with: its options and slots, and its
  // type parameters' defaults. It's the first argument of `createParts` and `definePart`.
  function primitiveTypes(call: ts.CallExpression) {
    const primitive = call.arguments[0]
    const signature = checker
      .getTypeAtLocation(primitive)
      .getCallSignatures()[0]
    const generics = new Map<string, string>()
    for (const parameter of signature.typeParameters ?? []) {
      const fallback = parameter.getDefault() ?? parameter.getConstraint()
      generics.set(
        parameter.symbol.name,
        fallback ? checker.typeToString(fallback) : "unknown"
      )
    }
    const types = property(signature.getReturnType(), "types")?.type
    return {
      options: property(types, "options")?.type,
      slots: property(types, "slots")?.type,
      api: property(types, "api")?.type,
      generics,
    }
  }

  // The props a slot takes: `SlotDefinition`'s third type argument. A slot
  // a feature ships, like a select's item icon, is in the feature's slots.
  function slotProps(
    slots: ts.Type | undefined,
    slot: string,
    key: string,
    call: ts.CallExpression
  ) {
    const feature = property(
      property(partOptions(call, key), "feature")?.type,
      "slots"
    )
    const definition =
      property(slots, slot)?.type ?? property(feature?.type, slot)?.type
    if (!definition) {
      return undefined
    }
    if (definition.aliasTypeArguments) {
      return definition.aliasTypeArguments[2]
    }
    // A slot built by a helper, like a shortcut slot, has lost the alias. Its
    // functions' context still has the props.
    for (const name of ["attrs", "state", "present"]) {
      const fn = property(definition, name)?.type
      const context =
        fn &&
        checker.getNonNullableType(fn).getCallSignatures()[0]?.parameters[1]
      if (context) {
        return property(checker.getTypeOfSymbol(context), "props")?.type
      }
    }
  }

  // The element types and their events, from the `HTMLElementTagNameMap` in events.ts.
  const elementTypes = new Map<
    string,
    { node: ts.InterfaceDeclaration; events?: ts.Type }
  >()
  const eventsFile = program.getSourceFile(path.join(web, "events.ts"))!
  const interfaces = new Map<string, ts.InterfaceDeclaration>()
  eventsFile.forEachChild((node) => {
    if (ts.isInterfaceDeclaration(node)) {
      interfaces.set(node.name.text, node)
    }
  })
  const tagMap = eventsFile.statements
    .filter(ts.isModuleDeclaration)
    .flatMap((node) =>
      node.body && ts.isModuleBlock(node.body) ? node.body.statements : []
    )
    .find(
      (node): node is ts.InterfaceDeclaration =>
        ts.isInterfaceDeclaration(node) &&
        node.name.text === "HTMLElementTagNameMap"
    )
  // A part's events, from the event map its `UiPartElement` type gives `UiElement`.
  const partEvents = new Map<string, ts.Type>()
  for (const member of tagMap?.members ?? []) {
    if (
      !ts.isPropertySignature(member) ||
      !member.type ||
      !ts.isTypeReferenceNode(member.type)
    ) {
      continue
    }
    if (member.type.typeName.getText() === "UiPartElement") {
      const element = checker.getTypeFromTypeNode(member.type)
      const base = (element.isIntersection() ? element.types : [element]).find(
        (type) => type.symbol?.name === "UiElement"
      )
      if (base) {
        partEvents.set(
          (member.name as ts.StringLiteral).text,
          checker.getTypeArguments(base as ts.TypeReference)[0]
        )
      }
      continue
    }
    const node = interfaces.get(member.type.typeName.getText())
    if (!node) {
      continue
    }
    const base = node.heritageClauses?.[0]?.types.find(
      (type) => type.expression.getText() === "UiElement"
    )
    const events = base?.typeArguments?.[0]
    elementTypes.set((member.name as ts.StringLiteral).text, {
      node,
      events: events && checker.getTypeFromTypeNode(events),
    })
  }

  // The controller a component's docs page documents, like `SliderController`.
  function pageController(entry: string) {
    const page = docPage(["web-components", "components", entry])
    const [, file, name] =
      (page &&
        readFileSync(page.file, "utf8").match(
          /<ControllerTable\s+path="([^"]+)"\s+name="(\w+)"/
        )) ??
      []
    if (!file) {
      return undefined
    }
    const source = program.getSourceFile(
      path.resolve(repoRoot, "apps/docs", file)
    )
    const symbol = source && checker.getSymbolAtLocation(source)
    const exported =
      symbol &&
      checker
        .getExportsOfModule(symbol)
        .find((candidate) => candidate.name === name)
    return exported ? checker.getDeclaredTypeOfSymbol(exported) : undefined
  }

  // Each tag once, from the first entry that defines it.
  const definitions = new Map<string, Located & { entries: string[] }>()
  for (const definition of recorded) {
    const known = definitions.get(definition.tagName)
    if (known) {
      if (!known.entries.includes(definition.entry)) {
        known.entries.push(definition.entry)
      }
    } else {
      definitions.set(definition.tagName, {
        ...definition,
        entries: [definition.entry],
      })
    }
  }
  const owners = new Map<string, ReturnType<typeof primitiveTypes>>()
  for (const definition of definitions.values()) {
    if (definition.kind === "owner") {
      owners.set(definition.tagName, primitiveTypes(callAt(definition)))
    }
  }

  // Styling hooks from the components' docs pages: data attributes per part
  // and the CSS variables each component writes.
  const dataAttributes = new Map<string, ElementDoc["dataAttributes"]>()
  const cssProperties = new Map<string, ElementDoc["cssProperties"]>()
  for (const page of docPages("web-components/components")) {
    const source = readFileSync(page.file, "utf8")
    const components = (tag: string) =>
      new Set(
        [
          ...source.matchAll(
            new RegExp(`<${tag}[^>]*component="([\\w-]+)"`, "g")
          ),
        ].map(([, name]) => name)
      )
    for (const component of components("DataAttributes")) {
      for (const part of (
        await dataAttributeTables(component, "web-components")
      ).styled) {
        const tagName = part.name.replace(/^<|>$/g, "")
        if (!definitions.has(tagName) || dataAttributes.has(tagName)) {
          continue
        }
        dataAttributes.set(
          tagName,
          part.attributes.map((row) => ({
            name: row.attribute,
            description: row.text,
            values: row.values.length ? row.values : undefined,
          }))
        )
      }
    }
    // Each variable on the element that carries it, else on the owner, like one on <html>.
    for (const component of components("CssVariables")) {
      const owner = definitions.has(`ui-${component}`)
        ? `ui-${component}`
        : `ui-${page.slugs[1]}`
      for (const { name, variables } of cssVariableTable(
        component,
        "web-components"
      )) {
        const tagName = definitions.has(name.replace(/^<|>$/g, ""))
          ? name.replace(/^<|>$/g, "")
          : owner
        const rows = cssProperties.get(tagName) ?? []
        for (const variable of variables) {
          if (!rows.some((row) => row.name === variable.name)) {
            rows.push({ name: variable.name, description: variable.text })
          }
        }
        cssProperties.set(tagName, rows)
      }
    }
  }

  const docs: ElementDoc[] = []
  for (const definition of definitions.values()) {
    const { tagName, kind, config } = definition
    const label = (what: string) => `<${tagName}> ${what}`
    const call = callAt(definition)
    const ownerTags: string[] =
      kind === "part"
        ? String(config.owner)
            .split(",")
            .map((owner) => owner.trim())
        : []
    const owner = ownerTags.map((tag) => owners.get(tag)).find(Boolean)
    const types = kind === "owner" ? owners.get(tagName) : undefined
    const generics = (types ?? owner)?.generics ?? new Map<string, string>()
    // Owners take options, parts the props of their slot.
    const key = definition.key ?? config.slot ?? "root"
    const fields =
      kind === "owner"
        ? types?.options
        : slotProps(owner?.slots, config.slot ?? "", key, call)
    const element = elementTypes.get(tagName)
    const entry = definition.entries[0]

    const attributes: Field[] = []
    const schema = (kind === "owner" ? config.attributes : config.props) ?? {}
    for (const [name, parse] of Object.entries(schema)) {
      const found = property(fields, name)
      const field = fieldOf(
        name,
        found,
        generics,
        label(`attribute ${kebab(name)}`)
      )
      if (parse === "list") {
        field.description =
          `${field.description ?? ""} In the attribute, separate values with commas.`.trim()
      }
      attributes.push({
        ...field,
        name: kebab(name),
        type: found
          ? attributeType(parse, found.type, generics)
          : typeof parse === "string"
            ? parse
            : "string",
      })
    }
    if (kind === "owner") {
      attributes.push(debug)
    }
    if (kind === "part") {
      attributes.push({
        name: "for",
        type: "string",
        description: `The id of the ${ownerTags.map((tag) => `<${tag}>`).join(" or ")} it belongs to, when it isn't inside it.`,
      })
      if (!config.target) {
        attributes.push({
          name: "as-child",
          type: "boolean",
          description:
            "Binds its first child instead of itself, like a link, and takes no box of its own.",
        })
      }
    }

    // Live state, set properties and what the element type declares.
    const properties: Field[] = []
    const elementType = element && checker.getTypeAtLocation(element.node)
    // What events.ts declares on the element type, in it or in an interface
    // it extends there, like a form-associated element's `form`, without the
    // listener methods every element type has.
    const declaredMembers = (
      elementType ? checker.getPropertiesOfType(elementType) : []
    ).flatMap((symbol) => {
      const node = symbol.declarations?.find(
        (declaration) => declaration.getSourceFile() === eventsFile
      )
      return node && node.parent !== interfaces.get("UiElement")
        ? [{ symbol, node }]
        : []
    })
    const declared = new Set(
      declaredMembers
        .filter(({ node }) => ts.isPropertySignature(node))
        .map(({ symbol }) => symbol.name)
    )
    const own = [
      ...Object.keys(config.state ?? {}),
      ...(config.properties ?? []),
      ...[...declared].filter((name) => name !== "api"),
    ]
    for (const name of new Set<string>([...own, ...Object.keys(schema)])) {
      // The element type's own field, described by the option of the same
      // name when it says nothing itself, like `value`.
      const declaration = declared.has(name)
        ? property(elementType, name)
        : undefined
      const option = property(fields, name)
      const field = fieldOf(
        name,
        declaration ?? option,
        generics,
        label(`property ${name}`),
        option
      )
      const readonly = declaration?.symbol.declarations?.some(
        (node) => ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Readonly
      )
      if (readonly) {
        field.readonly = true
      }
      // A boolean attribute's property reads its default when the attribute
      // is missing: true for the ones the define call says start on, which
      // the core's docs agree with, else false. One the element decides, like
      // `closeOnOutsidePress` from `modal`, reads true where the core's docs say "true, or …".
      const on = config.defaults?.[name]
      if (
        !own.includes(name) &&
        (on !== undefined || schema[name] === "boolean")
      ) {
        field.default = String(!!on)
      }
      properties.push(field)
    }
    if (kind === "owner") {
      properties.push({ ...debug, default: "false" })
    }
    // The controller type the element type names, else the one its docs
    // page's reference shows, described in the core, else the primitive's own api.
    const controller =
      property(elementType, "api")?.type ?? pageController(entry) ?? types?.api
    const methods = (config.api ?? []).flatMap((name) => {
      const method = property(controller, name)
      const signature =
        method &&
        checker.getSignaturesOfType(method.type, ts.SignatureKind.Call)[0]
      if (!signature) {
        missing.push(label(`api.${name}`))
        return []
      }
      const text = docsOf(method.symbol)
      if (!text) {
        missing.push(label(`api.${name}`))
      }
      return [{ name, signature: typeText(method.type, generics), text }]
    })
    if (methods.length) {
      properties.push({
        name: "api",
        type: `{ ${methods.map((method) => `${method.name}: ${method.signature}`).join("; ")} }`,
        description: [
          "The controller's methods, undefined until the element connects.",
          ...methods.map((method) => `\`${method.name}()\`: ${method.text}`),
        ].join(" "),
      })
    }

    const elementMethods = declaredMembers.flatMap(({ symbol, node }) => {
      if (!ts.isMethodSignature(node)) {
        return []
      }
      const signature = checker.getSignaturesOfType(
        checker.getTypeOfSymbol(symbol),
        ts.SignatureKind.Call
      )[0]
      const description = docsOf(symbol)
      if (!description) {
        missing.push(label(`method ${symbol.name}`))
      }
      return [
        {
          name: symbol.name,
          description: description || undefined,
          parameters: signature.parameters.map((parameter) => ({
            name: parameter.name,
            type: checker.typeToString(checker.getTypeOfSymbol(parameter)),
          })),
          returns: checker.typeToString(signature.getReturnType()),
        },
      ]
    })
    // The element type has to say what the runtime adds to a form-associated element.
    if (
      config.formAssociated &&
      !elementMethods.some(({ name }) => name === "checkValidity")
    ) {
      missing.push(label("form members, like checkValidity()"))
    }

    // Callbacks fire as events, in lowercase without `on` or as the define call's
    // `events` names them. A part fires the events its type lists: its slot's
    // callbacks, unless its define call fires others, like a dialog close's `action`.
    const typedPart = partEvents.get(tagName)
    const events: Field[] = []
    for (const symbol of fields ? checker.getPropertiesOfType(fields) : []) {
      const name = symbol.name
      const callback = /^on[A-Z]/.test(name)
      const event = callback
        ? (config.events?.[name] ?? name.slice(2).toLowerCase())
        : name
      if (
        typedPart
          ? !property(typedPart, event)
          : !callback || config.silent?.includes(name)
      ) {
        continue
      }
      const field = fieldOf(
        event,
        property(fields, name),
        generics,
        label(`event ${event}`)
      )
      const typed = property(typedPart ?? element?.events, event)
      const typeNode = typed?.symbol.valueDeclaration as
        ts.PropertySignature | undefined
      const type = typeNode?.type
        ? oneLine(typeNode.type.getText())
        : typed
          ? checker.typeToString(
              typed.type,
              undefined,
              ts.TypeFormatFlags.NoTruncation
            )
          : "CustomEvent"
      events.push({ ...field, type })
    }

    // What it is: a component's root has its docs page's summary and
    // composition. Other elements have the comment above their define call, and
    // owners the comment above the function that defines them too.
    const page =
      tagName === `ui-${entry}`
        ? docPage(["web-components", "components", entry])
        : undefined
    const fn = kind === "part" ? undefined : enclosingFunction(call)
    const described = describedNode(call, key)
    const description = page
      ? [page.description, await composition(page.file)]
          .filter(Boolean)
          .join("\n\n")
      : (described ? commentAbove(described) : "") ||
        (fn ? commentAbove(fn) : "")
    if (!description && kind !== "part") {
      missing.push(label("description"))
    }

    docs.push({
      tagName,
      kind,
      entries: definition.entries,
      owners: ownerTags,
      parts: [],
      description,
      attributes,
      properties,
      methods: elementMethods,
      events,
      dataAttributes: dataAttributes.get(tagName) ?? [],
      cssProperties: cssProperties.get(tagName) ?? [],
    })
  }
  for (const doc of docs) {
    for (const owner of doc.owners) {
      docs
        .find((candidate) => candidate.tagName === owner)
        ?.parts.push(doc.tagName)
    }
  }
  return { entries, elements: docs, missing }
}

// A component's composition with web components, from its docs page: the
// part tree and what the page says about it.
async function composition(file: string) {
  const markdown = await pageMarkdown(file, "web-components", () => null)
  return markdown.match(/\n## Composition\n([\s\S]*?)(?=\n## )/)?.[1].trim()
}

// The entry an element is declared in: the one named like it, like `tabs`
// for <ui-tabs-tab>, else the first that defines it.
function home(doc: ElementDoc) {
  const named = doc.entries
    .filter(
      (entry) =>
        doc.tagName === `ui-${entry}` || doc.tagName.startsWith(`ui-${entry}-`)
    )
    .sort((a, b) => b.length - a.length)
  return named[0] ?? doc.entries[0]
}

const modulePath = (entry: string) => `dist/entries/${entry}.js`

// The summary editors show: what it is, how it fits with the other elements
// and how to define it.
function summary(doc: ElementDoc) {
  const lines = [doc.description]
  if (doc.owners.length) {
    lines.push(
      `Part of ${doc.owners.map((tag) => `\`<${tag}>\``).join(" or ")}.`
    )
  }
  if (doc.parts.length) {
    lines.push(`Parts: ${doc.parts.map((tag) => `\`<${tag}>\``).join(", ")}.`)
  }
  lines.push(`Defined by \`import "@ui-sdk/web/${home(doc)}"\`.`)
  if (doc.dataAttributes.length) {
    lines.push(
      `Styling hooks: ${doc.dataAttributes
        .map(
          (row) =>
            `\`${row.name}\`${row.description ? ` (${row.description.replace(/\.$/, "")})` : ""}`
        )
        .join(", ")}.`
    )
  }
  return lines.filter(Boolean).join("\n\n")
}

/** The custom elements manifest, schema 2.1. */
function customElementsManifest(elements: ElementDoc[], entries: string[]) {
  const field = ({
    name,
    type,
    description,
    default: fallback,
    readonly,
  }: Field) => ({
    name,
    ...(type && { type: { text: type } }),
    ...(description && { description }),
    ...(fallback && { default: fallback }),
    ...(readonly && { readonly }),
  })
  return {
    schemaVersion: "2.1.0",
    readme: "README.md",
    modules: entries.map((entry) => ({
      kind: "javascript-module",
      path: modulePath(entry),
      declarations: elements
        .filter((doc) => home(doc) === entry)
        .map((doc) => ({
          kind: "class",
          name: `${pascal(doc.tagName)}Element`,
          tagName: doc.tagName,
          customElement: true,
          description: summary(doc),
          superclass: { name: "HTMLElement" },
          attributes: doc.attributes.map((attribute) => {
            // A readonly property, like a form-associated element's `form`,
            // doesn't reflect its attribute, so a tool can't set it in its place.
            const property = doc.properties.find(
              (candidate) =>
                kebab(candidate.name) === attribute.name && !candidate.readonly
            )
            return {
              ...field(attribute),
              ...(property && { fieldName: property.name }),
            }
          }),
          members: [
            ...doc.properties.map((property) => ({
              kind: "field",
              ...field(property),
            })),
            ...doc.methods.map(
              ({ name, description, parameters, returns }) => ({
                kind: "method",
                name,
                ...(description && { description }),
                parameters: parameters.map((parameter) => ({
                  name: parameter.name,
                  type: { text: parameter.type },
                })),
                return: { type: { text: returns } },
              })
            ),
          ],
          events: doc.events.map(field),
          ...(doc.cssProperties.length && {
            cssProperties: doc.cssProperties.map(field),
          }),
        })),
      exports: elements
        .filter((doc) => doc.entries.includes(entry))
        .map((doc) => ({
          kind: "custom-element-definition",
          name: doc.tagName,
          declaration: {
            name: `${pascal(doc.tagName)}Element`,
            module: modulePath(home(doc)),
          },
        })),
    })),
  }
}

// An attribute's values, when its type is a union of string literals.
const literalValues = (type?: string) =>
  type && /^"[^"]*"( \| "[^"]*")*$/.test(type)
    ? [...type.matchAll(/"([^"]*)"/g)].map((match) => match[1])
    : undefined

/** VS Code's HTML custom data, for completion and hover in HTML files. */
function htmlCustomData(elements: ElementDoc[]) {
  return {
    version: 1.1,
    tags: elements.map((doc) => ({
      name: doc.tagName,
      description: { kind: "markdown", value: summary(doc) },
      attributes: doc.attributes.map((attribute) => {
        const values = literalValues(attribute.type)
        return {
          name: attribute.name,
          description: {
            kind: "markdown",
            value: [
              attribute.description,
              attribute.type && `\`${attribute.type}\``,
            ]
              .filter(Boolean)
              .join("\n\n"),
          },
          ...(attribute.type === "boolean" && { valueSet: "v" }),
          ...(values && { values: values.map((name) => ({ name })) }),
        }
      }),
    })),
  }
}

export {
  customElementsManifest,
  describeElements,
  type ElementDoc,
  htmlCustomData,
}
