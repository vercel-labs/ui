import path from "node:path"

type Location = { start: { line: number } }
type Node = { type: number; tagType?: number; loc: Location; props?: unknown[] }
type Context = { filename: string }

const expression = (content: string, loc: Location, isStatic: boolean) => ({
  type: 4,
  content,
  isStatic,
  constType: isStatic ? 3 : 0,
  loc,
})

// Stamps app templates with their file and line so a click opens the code behind
// it. Components get a vnode hook instead of an attribute, which would warn on
// components that render a fragment.
function vueSourceLocations(root: string) {
  return (node: Node, context: Context) => {
    if (
      node.type !== 1 ||
      !node.props ||
      node.tagType === undefined ||
      node.tagType > 1
    ) {
      return
    }
    const file = path.relative(root, context.filename)
    if (file.startsWith("..")) {
      return
    }
    const at = `${file}:${node.loc.start.line}`
    if (node.tagType === 0) {
      node.props.push({
        type: 6,
        name: "data-review-loc",
        nameLoc: node.loc,
        value: { type: 2, content: at, loc: node.loc },
        loc: node.loc,
      })
      return
    }
    node.props.push({
      type: 7,
      name: "on",
      rawName: "@vue:before-mount",
      arg: expression("vue:before-mount", node.loc, true),
      exp: expression(
        `(vnode) => { if (vnode.component) vnode.component.__reviewLoc = ${JSON.stringify(at)} }`,
        node.loc,
        false
      ),
      modifiers: [],
      loc: node.loc,
    })
  }
}

export { vueSourceLocations }
