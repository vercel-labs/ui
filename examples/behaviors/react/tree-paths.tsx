import * as React from "react"
import { createTreeCollection, treeDataNodes, treeFromPaths } from "@ui-sdk/core"

function Example() {
  const [text, setText] = React.useState("src/index.ts\nsrc/lib/util.ts\nREADME.md\nassets/")
  const items = treeFromPaths(text.split("\n").filter(Boolean))
  const nodes = treeDataNodes(items)
  const tree = createTreeCollection(nodes)
  return (
    <div data-slot="tree-behavior-paths">
      <textarea aria-label="Paths" value={text} onChange={(event) => setText(event.target.value)} />
      <div data-tree data-slot="tree-behavior-list">
        {nodes.map(({ key, item }) => (
          <span
            key={key}
            data-slot="tree-behavior-row"
            style={{ paddingInlineStart: `${(tree.level(key) - 1) * 14 + 8}px` }}
          >
            {item.children ? "📁 " : ""}
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export { Example }
