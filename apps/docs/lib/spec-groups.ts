import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import path from "node:path"
import ts from "typescript"
import { repoRoot } from "./repo-root"

// The playground projects the specs run in (tests/playwright.config.ts).
const tested = { react: "React", vue: "Vue", web: "web components" }
type Tested = keyof typeof tested
const allTested = Object.keys(tested) as Tested[]

type Test = { title: string; frameworks: Tested[] }
type Group = { title: string; tests: Test[] }

// The callee of `test(…)`, `test.describe(…)` or `test.skip(…)`, as a dotted name.
function calleeName(node: ts.Expression): string {
  if (ts.isIdentifier(node)) return node.text
  if (ts.isPropertyAccessExpression(node)) return `${calleeName(node.expression)}.${node.name.text}`
  return ""
}

// A title as written. Template parts like `${key}` come back as their
// placeholder, so loops can expand them.
function titleOf(node: ts.Expression | undefined) {
  if (!node) return undefined
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node))
    return node.head.text + node.templateSpans.map((span) => `\${}${span.literal.text}`).join("")
  return undefined
}

// The strings a `for (const key of ["a", "b"])` loop runs over.
function loopValues(node: ts.Node) {
  if (!ts.isForOfStatement(node) || !ts.isArrayLiteralExpression(node.expression)) return undefined
  const values = node.expression.elements.map((element) =>
    ts.isStringLiteral(element) || ts.isNoSubstitutionTemplateLiteral(element) ? element.text : undefined,
  )
  return values.every((value) => value !== undefined) ? (values as string[]) : undefined
}

// Whether the playground has `fixture` for `framework`, as in tests/fixture-files.ts.
function hasFixture(fixture: string, framework: Tested) {
  const folder = path.join(repoRoot, "apps/playground/src/fixtures", fixture)
  return ["ts", "tsx"].some((extension) => existsSync(path.join(folder, `${framework}.${extension}`)))
}

// The fixtures `open("…")` loads anywhere under `node`.
function fixturesIn(node: ts.Node) {
  const fixtures: string[] = []
  const visit = (child: ts.Node) => {
    if (ts.isCallExpression(child) && calleeName(child.expression) === "open") {
      const title = titleOf(child.arguments[0])
      if (title) fixtures.push(title)
    }
    ts.forEachChild(child, visit)
  }
  visit(node)
  return fixtures
}

// A skip condition's value for one framework, when it reads nothing but
// `framework`, like `framework.startsWith("web")`. Anything else, like the
// browser, isn't a framework restriction, and comes back undefined. It's
// recursive, so TypeScript needs its return type.
function evaluate(node: ts.Expression, framework: Tested): boolean | string | undefined {
  if (ts.isParenthesizedExpression(node)) return evaluate(node.expression, framework)
  if (ts.isStringLiteral(node)) return node.text
  if (ts.isIdentifier(node)) return node.text === "framework" ? framework : undefined
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.ExclamationToken) {
    const value = evaluate(node.operand, framework)
    return value === undefined ? undefined : !value
  }
  if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
    const target = evaluate(node.expression.expression, framework)
    const argument = node.arguments[0] && evaluate(node.arguments[0], framework)
    const method = node.expression.name.text
    if (typeof target !== "string" || typeof argument !== "string") return undefined
    if (method === "startsWith") return target.startsWith(argument)
    if (method === "endsWith") return target.endsWith(argument)
    if (method === "includes") return target.includes(argument)
    return undefined
  }
  if (ts.isBinaryExpression(node)) {
    const left = evaluate(node.left, framework)
    const right = evaluate(node.right, framework)
    if (left === undefined || right === undefined) return undefined
    switch (node.operatorToken.kind) {
      case ts.SyntaxKind.EqualsEqualsEqualsToken:
        return left === right
      case ts.SyntaxKind.ExclamationEqualsEqualsToken:
        return left !== right
      case ts.SyntaxKind.AmpersandAmpersandToken:
        return !!left && !!right
      case ts.SyntaxKind.BarBarToken:
        return !!left || !!right
    }
  }
  return undefined
}

// The conditions of the `test.skip(…)` calls that apply to every test in
// `scope`, a file, a group's callback or a test's body: its own and its hooks',
// but not those of the tests and groups inside it.
function skipsIn(scope: ts.Node) {
  const skips: ts.Expression[] = []
  const visit = (child: ts.Node) => {
    if (ts.isCallExpression(child)) {
      const name = calleeName(child.expression)
      if (name === "test.skip" && child.arguments[0]) skips.push(child.arguments[0])
      if (name === "test" || name === "test.fixme" || name.startsWith("test.describe")) return
    }
    ts.forEachChild(child, visit)
  }
  ts.forEachChild(scope, visit)
  return skips
}

// The callback of `test(…)` or `test.describe(…)`.
const callbackOf = (call: ts.CallExpression) =>
  call.arguments.find((argument) => ts.isArrowFunction(argument) || ts.isFunctionExpression(argument))

// The frameworks a test runs in: those with a fixture it opens, or the
// file opens when it opens none itself, minus those a `test.skip` skips,
// in the test or in the groups and hooks around it.
function frameworksOf(test: ts.CallExpression, fileFixtures: string[], groupSkips: ts.Expression[]) {
  const body = callbackOf(test)
  if (!body) return allTested
  const own = fixturesIn(body)
  const fixtures = own.length ? own : fileFixtures
  const skips = [...groupSkips, ...skipsIn(body)]
  return allTested.filter(
    (framework) =>
      (!fixtures.length || fixtures.some((fixture) => hasFixture(fixture, framework))) &&
      !skips.some((skip) => evaluate(skip, framework) === true),
  )
}

// Reads test titles from a spec file with the TypeScript parser, so titles
// Prettier wrapped onto their own line are found too. Tests in a
// `for (const key of [...])` loop are expanded, with " " read as Space.
async function readSpec(spec: string) {
  const file = path.join(repoRoot, "tests/specs", `${spec}.spec.ts`)
  const source = ts.createSourceFile(file, await readFile(file, "utf8"), ts.ScriptTarget.Latest, true)
  const fileFixtures = fixturesIn(source)
  const groups: Group[] = [{ title: "", tests: [] }]

  const visit = (node: ts.Node, group: Group, keys: string[] | undefined, skips: ts.Expression[]) => {
    const values = loopValues(node)
    if (values) {
      ts.forEachChild(node, (child) => visit(child, group, values, skips))
      return
    }
    if (ts.isCallExpression(node)) {
      const name = calleeName(node.expression)
      // The "@enhancement" tag some titles carry is for the test runner. Titles
      // can mention people, like "@ada", so only the tag is dropped.
      const title = titleOf(node.arguments[0])?.replaceAll(" @enhancement", "")
      if (name.startsWith("test.describe") && title !== undefined) {
        // Two describes with one title, like a plain and an enhancement block, read as one group.
        let inner = groups.find((existing) => existing.title === title)
        if (!inner) groups.push((inner = { title, tests: [] }))
        const callback = callbackOf(node)
        const innerSkips = callback ? [...skips, ...skipsIn(callback)] : skips
        ts.forEachChild(node, (child) => visit(child, inner, keys, innerSkips))
        return
      }
      if ((name === "test" || name === "test.fixme") && title !== undefined) {
        const frameworks = frameworksOf(node, fileFixtures, skips)
        if (title.includes("${}") && keys)
          for (const key of keys)
            group.tests.push({ title: title.replace("${}", key === " " ? "Space" : key), frameworks })
        else group.tests.push({ title: title.replaceAll("${}", "…"), frameworks })
        return
      }
    }
    ts.forEachChild(node, (child) => visit(child, group, keys, skips))
  }
  visit(source, groups[0], undefined, skipsIn(source))
  return groups.filter((group) => group.tests.length)
}

const sentence = (text: string) => text[0].toUpperCase() + text.slice(1)

// "React, Vue and web components".
function listOf(frameworks: Tested[]) {
  const names = frameworks.map((framework) => tested[framework])
  return names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`
}

/**
 * A spec's tests as the behavior they prove, by group, each with the
 * frameworks it runs in, and every framework any of them runs in.
 */
async function specGroups(spec: string, only?: string[]) {
  const groups = (await readSpec(spec)).filter((group) => !only || only.includes(group.title))
  const frameworks = allTested.filter((framework) =>
    groups.some((group) => group.tests.some((test) => test.frameworks.includes(framework))),
  )
  return { groups, frameworks }
}

export { listOf, sentence, specGroups }
