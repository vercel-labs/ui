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
        <TreeItem
          value={item.value}
          branch={item.children !== undefined}
          class="flex flex-wrap items-center outline-none"
        >
          <Show when={item.children}>
            <TreeItemIndicator class="flex size-4 cursor-default shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200 data-expanded:rotate-90 rtl:rotate-180 rtl:data-expanded:rotate-90 before:content-['›']" />
          </Show>
          <TreeItemLabel class="flex h-7 min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset flex-1 not-data-branch:ms-4">
            {item.label}
          </TreeItemLabel>
          <Show when={item.children}>
            {(children) => (
              <TreeGroup class="h-(--tree-group-height) overflow-hidden ps-4 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 basis-full">
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
    <div class="flex w-72 max-w-full flex-col gap-3">
      <Tree
        aria-label="Folders"
        items={items}
        mode="multiple"
        value={value()}
        onValueChange={setValue}
        expandOnPress={false}
        defaultExpanded={["inbox", "projects"]}
        class="flex h-80 w-full flex-col overflow-y-auto rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground"
      >
        <Items items={items} />
      </Tree>
      <p class="m-0 block min-h-10 text-sm leading-5 text-muted-foreground">{value().length} selected</p>
    </div>
  )
}

export { Example }
