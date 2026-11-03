"use client"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/react/tree"

const items: TreeItemData[] = [
  {
    value: "fruit",
    label: "Fruit",
    children: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      {
        value: "citrus",
        label: "Citrus",
        children: [
          { value: "lemon", label: "Lemon" },
          { value: "orange", label: "Orange" },
        ],
      },
    ],
  },
  {
    value: "vegetables",
    label: "Vegetables",
    children: [
      { value: "carrot", label: "Carrot" },
      { value: "kale", label: "Kale", disabled: true },
    ],
  },
  { value: "bread", label: "Bread" },
]

function Items({ items }: { items: TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value} disabled={item.disabled}>
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
  return (
    <Tree aria-label="Groceries" items={items} defaultExpanded={["fruit"]}>
      <Items items={items} />
    </Tree>
  )
}

export { Example }
