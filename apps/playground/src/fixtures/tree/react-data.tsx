import { createTreeController, Tree } from "@ui-sdk/react/tree"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { describeTree, treeFixture } from "tests/fixtures/tree.ts"
import { treeOptions } from "tests/fixtures/page.ts"
import { Items } from "./react"

const controller = createTreeController()

// The same tree with its items as data, which give it its whole shape: typeahead and the
// controller reach items in collapsed branches.
function Fixture() {
  const [action, setAction] = React.useState("")
  const { cancel, ...options } = treeOptions()
  return (
    <div className="fixture">
      <button>Before</button>
      <Tree
        className="tree"
        aria-label={treeFixture.label}
        items={treeFixture.items}
        controller={controller}
        {...options}
        onValueChange={(value) => setAction(describeTree("selected", value))}
        onExpandedChange={(expanded, details) => {
          if (
            cancel &&
            expanded.includes(cancel) &&
            !controller.isExpanded(cancel)
          ) {
            return details.cancel()
          }
          setAction(describeTree("expanded", expanded))
        }}
        onCheckedChange={(checked) =>
          setAction(describeTree("checked", checked))
        }
        onAction={(value) => setAction(describeTree("action", value))}
      >
        <Items items={treeFixture.items} checkable={options.checkable} />
      </Tree>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <button onClick={() => controller.expandAll()}>Expand all</button>
      <button onClick={() => controller.collapseAll()}>Collapse all</button>
      <button onClick={() => controller.reveal("dialog.tsx")}>
        Reveal dialog
      </button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
