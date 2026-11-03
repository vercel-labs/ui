import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/solid/tree"
import { createSignal, For, Show } from "solid-js"

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

function Items(props: { items: TreeItemData[] }) {
  return (
    <For each={props.items}>
      {(item) => (
        <TreeItem value={item.value} branch={item.children !== undefined}>
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
  const [value, setValue] = createSignal(["updates", "website"])
  return (
    <div data-slot="stack">
      <Tree
        aria-label="Folders"
        items={items}
        selectionMode="multiple"
        value={value()}
        onValueChange={setValue}
        expandOnPress={false}
        defaultExpanded={["inbox", "projects"]}
      >
        <Items items={items} />
      </Tree>
      <p data-slot="hint">{value().length} selected</p>
    </div>
  )
}

export { Example }
