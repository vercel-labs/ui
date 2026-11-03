"use client"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/react/tree"
import * as React from "react"

const items: TreeItemData[] = [
  {
    value: "inbox",
    label: "Inbox",
    children: [
      { value: "updates", label: "Updates" },
      { value: "forums", label: "Forums" },
      { value: "promotions", label: "Promotions" },
    ],
  },
  {
    value: "projects",
    label: "Projects",
    children: [
      { value: "website", label: "Website" },
      { value: "mobile", label: "Mobile app" },
    ],
  },
  { value: "archive", label: "Archive" },
  { value: "trash", label: "Trash" },
]

function Items({ items }: { items: TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value}>
      {item.children && <TreeItemIndicator />}
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
  const [value, setValue] = React.useState(["updates", "website"])
  return (
    <div data-slot="stack">
      <Tree
        aria-label="Folders"
        items={items}
        mode="multiple"
        value={value}
        onValueChange={setValue}
        expandOnPress={false}
        defaultExpanded={["inbox", "projects"]}
      >
        <Items items={items} />
      </Tree>
      <p data-slot="hint">{value.length} selected</p>
    </div>
  )
}

export { Example }
