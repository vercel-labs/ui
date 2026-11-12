import type { ElementContent } from "hast"
import type { ShikiTransformer } from "shiki"

// A token in the code's own color needs no span of its own: it inherits the
// color from the pre. Long component pages send and build about half as many elements.
const plainTokens = {
  name: "plain-tokens",
  pre(node) {
    const color = String(node.properties.style ?? "")
      .toLowerCase()
      .match(/--shiki-light:[^;]*;--shiki-dark:[^;]*/)?.[0]
    if (!color) {
      return
    }
    for (const code of node.children) {
      if (code.type === "element") {
        for (const line of code.children) {
          if (line.type === "element") {
            line.children = unwrap(line.children, color)
          }
        }
      }
    }
  },
} satisfies ShikiTransformer

function unwrap(nodes: ElementContent[], color: string) {
  const result: ElementContent[] = []
  for (const node of nodes) {
    const plain =
      node.type === "element" &&
      Object.keys(node.properties).length === 1 &&
      String(node.properties.style).toLowerCase() === color
    for (const child of plain ? node.children : [node]) {
      const last = result.at(-1)
      if (child.type === "text" && last?.type === "text") {
        last.value += child.value
      } else {
        result.push(child)
      }
    }
  }
  return result
}

export { plainTokens }
