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
        <TreeItem
          value={item.value}
          branch={item.children !== undefined}
          class="flex flex-wrap items-center outline-none"
        >
          <TreeItemCheckbox class="relative ms-2 flex size-4 cursor-default shrink-0 items-center justify-center rounded-[5px] border border-input bg-background after:text-[10px] after:leading-none after:text-primary-foreground data-checked:border-primary data-checked:bg-primary data-checked:after:content-['✓'] data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:after:content-['–']" />
          <TreeItemLabel class="flex h-7 min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset flex-1">
            {item.label}
          </TreeItemLabel>
          <Show when={item.children}>
            {(children) => (
              <TreeGroup class="h-(--tree-group-height) overflow-hidden ps-6 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 basis-full">
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
    <div class="flex w-72 max-w-full flex-col gap-3">
      <Tree
        aria-label="Stack"
        items={items}
        checkable
        mode="none"
        checkStrategy="trunk"
        defaultChecked={initial}
        onCheckedChange={setChecked}
        defaultExpanded={["frontend", "backend", "databases"]}
        class="flex h-80 w-full flex-col overflow-y-auto rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground"
      >
        <Items items={items} />
      </Tree>
      <p class="m-0 block min-h-10 text-sm leading-5 text-muted-foreground">
        Checked: {checked().join(", ") || "nothing"}
      </p>
    </div>
  )
}

export { Example }
