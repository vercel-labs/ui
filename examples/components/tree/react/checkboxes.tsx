"use client"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/react/tree"
import * as React from "react"

const items: TreeItemData[] = [
  {
    value: "frontend",
    label: "Frontend",
    children: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "svelte", label: "Svelte" },
    ],
  },
  {
    value: "backend",
    label: "Backend",
    children: [
      { value: "node", label: "Node" },
      {
        value: "databases",
        label: "Databases",
        children: [
          { value: "postgres", label: "Postgres" },
          { value: "sqlite", label: "SQLite" },
        ],
      },
    ],
  },
]

const initial = ["react", "postgres"]

function Items({ items }: { items: TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value}>
      <TreeItemCheckbox />
      <TreeItemLabel>{item.label}</TreeItemLabel>
      {item.children && (
        <TreeGroup>
          <Items items={item.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function Example() {
  const [checked, setChecked] = React.useState(initial)
  return (
    <div data-slot="stack">
      <Tree
        aria-label="Stack"
        items={items}
        checkable
        selectionMode="none"
        checkStrategy="trunk"
        defaultChecked={initial}
        onCheckedChange={setChecked}
        defaultExpanded={["frontend", "backend", "databases"]}
      >
        <Items items={items} />
      </Tree>
      <p data-slot="hint">Checked: {checked.join(", ") || "nothing"}</p>
    </div>
  )
}

export { Example }
