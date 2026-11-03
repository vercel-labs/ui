import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/solid/tree"
import { For, Show } from "solid-js"

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

function Items(props: { items: TreeItemData[] }) {
  return (
    <For each={props.items}>
      {(item) => (
        <TreeItem value={item.value} branch={item.children !== undefined} disabled={item.disabled}>
          <Show when={item.children}>
            <TreeItemIndicator />
          </Show>
          <TreeItemLabel>{item.label}</TreeItemLabel>
          <Show when={item.children}>
            {(children) => (
              <TreeGroup>
                <Items items={children()} />
              </TreeGroup>
            )}
          </Show>
        </TreeItem>
      )}
    </For>
  )
}

function Example() {
  return (
    <Tree aria-label="Groceries" items={items} defaultExpanded={["fruit"]}>
      <Items items={items} />
    </Tree>
  )
}

export { Example }
