// Stamps the elements an app writes with data-review-loc="file:line", so the
// review app can open the code behind a click. Used by the React, Solid and web
// trackers when TRACKER_REVIEW is set; Vue has its own template transform.
import path from "node:path"
import ts from "typescript"

const tagPattern = /<([a-zA-Z][\w-]*)(?=[\s/>])/g

// Components get it too: parts pass unknown attributes to their element, so a
// part shows the line that uses it. These take no attributes at all.
const bare = new Set([
  "Fragment",
  "Suspense",
  "StrictMode",
  "Show",
  "For",
  "Index",
  "Switch",
  "Match",
  "Dynamic",
  "Portal",
])

function stamp(code, file, root, find) {
  const relative = path.relative(root, file)
  if (relative.startsWith("..") || relative.split(path.sep).includes("node_modules")) return null
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const inserts = []
  const at = (position, offset) => {
    const { line } = source.getLineAndCharacterOfPosition(position)
    inserts.push({ offset, text: ` data-review-loc="${relative.split(path.sep).join("/")}:${line + 1}"` })
  }
  const visit = (node) => {
    find(node, at, source)
    ts.forEachChild(node, visit)
  }
  visit(source)
  if (inserts.length === 0) return null
  let result = code
  for (const { offset, text } of inserts.sort((a, b) => b.offset - a.offset)) {
    result = result.slice(0, offset) + text + result.slice(offset)
  }
  return result
}

function jsxLocations(code, file, root) {
  return stamp(code, file, root, (node, at) => {
    if (!ts.isJsxOpeningElement(node) && !ts.isJsxSelfClosingElement(node)) return
    if (!ts.isIdentifier(node.tagName) || bare.has(node.tagName.text)) return
    at(node.getStart(), node.attributes.pos)
  })
}

function litLocations(code, file, root) {
  return stamp(code, file, root, (node, at, source) => {
    if (!ts.isTaggedTemplateExpression(node) || node.tag.getText(source) !== "html") return
    const template = node.template
    const parts = ts.isNoSubstitutionTemplateLiteral(template)
      ? [template]
      : [template.head, ...template.templateSpans.map((span) => span.literal)]
    for (const part of parts) {
      const start = part.getStart(source)
      for (const match of part.getText(source).matchAll(tagPattern)) {
        const offset = start + match.index + 1 + match[1].length
        at(offset, offset)
      }
    }
  })
}

export { jsxLocations, litLocations }
