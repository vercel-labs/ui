import type { TreeItemData } from "@ui-sdk/core/tree"
import "@ui-sdk/web/tree"

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

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tree aria-label="Groceries" default-expanded="fruit">
      <template>
        <ui-tree-item>
          <ui-tree-item-indicator></ui-tree-item-indicator>
          <ui-tree-item-label></ui-tree-item-label>
          <ui-tree-group></ui-tree-group>
        </ui-tree-item>
      </template>
    </ui-tree>
  `
  const tree = root.querySelector("ui-tree")!
  tree.items = items
}

export { mount }
