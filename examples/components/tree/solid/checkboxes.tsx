import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/solid/tree"
import { createSignal, For, Show } from "solid-js"

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

function Items(props: { items: TreeItemData[] }) {
  return (
    <For each={props.items}>
      {(item) => (
        <TreeItem value={item.value} branch={item.children !== undefined}>
          <TreeItemCheckbox />
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
  const [checked, setChecked] = createSignal(initial)
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
      <p data-slot="hint">Checked: {checked().join(", ") || "nothing"}</p>
    </div>
  )
}

export { Example }
