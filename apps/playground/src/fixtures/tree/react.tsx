import {
  createTreeController,
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/react/tree"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  describeTree,
  treeFixture,
  type TreeFixtureItem,
} from "tests/fixtures/tree.ts"
import { treeOptions } from "tests/fixtures/page.ts"

const controller = createTreeController()

function Items({
  items,
  checkable,
}: {
  items: TreeFixtureItem[]
  checkable: boolean
}) {
  return items.map((item) => (
    <TreeItem
      key={item.value}
      className="tree-item"
      value={item.value}
      disabled={item.disabled}
    >
      {item.children && (
        <TreeItemIndicator className="tree-indicator">▸</TreeItemIndicator>
      )}
      {checkable && <TreeItemCheckbox className="tree-checkbox" />}
      <TreeItemLabel
        className="tree-label"
        render={item.href ? <a href={item.href} /> : undefined}
      >
        {item.label}
      </TreeItemLabel>
      {item.children && (
        <TreeGroup className="tree-group">
          <Items items={item.children} checkable={checkable} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function Fixture() {
  const [action, setAction] = React.useState("")
  const { cancel, ...options } = treeOptions()
  return (
    <div className="fixture">
      <button>Before</button>
      <Tree
        className="tree"
        aria-label={treeFixture.label}
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

export { Fixture, Items, mount }
