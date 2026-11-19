// Every /sink tile's tags, read from its code: the ui-sdk names its Demo
// reaches, through every top-level function, component and constant it uses.
// Writes app/sink/bento/uses.generated.ts.
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import prettier from "prettier"
import ts from "typescript"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const tilesDir = path.join(root, "app/sink/tiles")
const out = path.join(root, "app/sink/bento/uses.generated.ts")

// How a demo is put together rather than what it does, so never a tag.
const plumbing = new Set(["definePrimitive", "createParts"])

// A part counts as its component: `MenuItem` is `Menu`, `CalendarDay` from
// ".../date-picker" is `DatePicker`, and `AlertDialogContent` from ".../dialog"
// is `AlertDialog` when the tile imports that too.
function componentOf({ name, from }, uses) {
  if (!/^[A-Z]/.test(name)) {
    return name
  }
  const entry = from.split("/")[2]?.replaceAll("-", "")
  if (
    entry &&
    name.toLowerCase().startsWith(entry) &&
    name.length > entry.length
  ) {
    return name.slice(0, entry.length)
  }
  const roots = [...uses]
    .filter(
      (other) =>
        other.from === from &&
        other.name !== name &&
        name.startsWith(other.name)
    )
    .filter((other) => /[A-Z]/.test(name[other.name.length]))
    .sort((a, b) => a.name.length - b.name.length)
  const own = [...uses].find(
    (other) => other.from === from && other.name.toLowerCase() === entry
  )
  return roots[0]?.name ?? own?.name ?? name
}

// Every name a binding declares, like `Root` and `Item` in `const { Root, Item } = parts`.
function boundNames(name) {
  if (ts.isIdentifier(name)) {
    return [name.text]
  }
  return name.elements.flatMap((element) =>
    ts.isOmittedExpression(element) ? [] : boundNames(element.name)
  )
}

function usesIn(file) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const imported = new Map()
  const declarations = new Map()
  let list
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement)) {
      const from = statement.moduleSpecifier.text
      const clause = statement.importClause
      if (!from.startsWith("@ui-sdk/") || !clause || clause.isTypeOnly) {
        continue
      }
      const named = clause.namedBindings
      if (named && ts.isNamedImports(named)) {
        for (const element of named.elements) {
          if (!element.isTypeOnly) {
            imported.set(element.name.text, {
              name: (element.propertyName ?? element.name).text,
              from,
            })
          }
        }
      }
      continue
    }
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      declarations.set(statement.name.text, statement)
    } else if (ts.isClassDeclaration(statement) && statement.name) {
      declarations.set(statement.name.text, statement)
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.name.text === "tiles"
        ) {
          list = declaration.initializer
        } else {
          for (const name of boundNames(declaration.name)) {
            declarations.set(name, declaration)
          }
        }
      }
    }
  }
  // The names a declaration mentions, outside type positions.
  const mentions = new Map()
  const namesIn = (node) => {
    if (mentions.has(node)) {
      return mentions.get(node)
    }
    const names = new Set()
    const visit = (child) => {
      if (
        ts.isTypeNode(child) ||
        ts.isTypeAliasDeclaration(child) ||
        ts.isInterfaceDeclaration(child)
      ) {
        return
      }
      const parent = child.parent
      const key =
        (ts.isPropertyAssignment(parent) ||
          ts.isPropertyAccessExpression(parent)) &&
        parent.name === child
      if (ts.isIdentifier(child) && !key) {
        names.add(child.text)
      }
      ts.forEachChild(child, visit)
    }
    ts.forEachChild(node, visit)
    mentions.set(node, names)
    return names
  }
  const reach = (start) => {
    const uses = new Set()
    const seen = new Set()
    const pending = [start]
    while (pending.length) {
      const name = pending.pop()
      if (seen.has(name)) {
        continue
      }
      seen.add(name)
      if (imported.has(name)) {
        uses.add(imported.get(name))
      }
      const declaration = declarations.get(name)
      if (declaration) {
        for (const mention of namesIn(declaration)) {
          pending.push(mention)
        }
      }
    }
    return [...new Set([...uses].map((use) => componentOf(use, uses)))]
      .filter((name) => !plumbing.has(name))
      .sort()
  }
  const result = {}
  if (!list || !ts.isArrayLiteralExpression(list)) {
    throw new Error(`${file}: no \`tiles\` array`)
  }
  for (const element of list.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      continue
    }
    const property = (key) =>
      element.properties.find(
        (p) =>
          ts.isPropertyAssignment(p) &&
          ts.isIdentifier(p.name) &&
          p.name.text === key
      )
    const id = property("id")?.initializer
    const demo = property("Demo")?.initializer
    if (!id || !ts.isStringLiteral(id) || !demo || !ts.isIdentifier(demo)) {
      throw new Error(`${file}: a tile without id or Demo`)
    }
    result[id.text] = reach(demo.text)
  }
  return result
}

async function writeTileUses() {
  const uses = {}
  const files = readdirSync(tilesDir).filter((name) => name.endsWith(".tsx"))
  for (const name of files.sort()) {
    Object.assign(uses, usesIn(path.join(tilesDir, name)))
  }
  const text = await prettier.format(
    `// Generated by scripts/sink-uses.mjs from each tile's code. Don't edit.\nexport const uses: Record<string, string[]> = ${JSON.stringify(uses)}\n`,
    { ...(await prettier.resolveConfig(out)), filepath: out }
  )
  let before = ""
  try {
    before = readFileSync(out, "utf8")
  } catch {}
  if (before !== text) {
    writeFileSync(out, text)
  }
  return uses
}

const uses = await writeTileUses()
console.log(
  `${Object.keys(uses).length} tiles, ${new Set(Object.values(uses).flat()).size} names`
)
