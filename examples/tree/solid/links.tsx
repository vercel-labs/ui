import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/solid/tree"
import { createSignal, For, Show } from "solid-js"

const pages: TreeItemData[] = [
  {
    value: "getting-started",
    label: "Getting started",
    children: [
      { value: "introduction", label: "Introduction", href: "#introduction" },
      { value: "installation", label: "Installation", href: "#installation" },
    ],
  },
  {
    value: "components",
    label: "Components",
    children: [
      { value: "accordion", label: "Accordion", href: "#accordion" },
      { value: "dialog", label: "Dialog", href: "#dialog" },
      { value: "tree", label: "Tree", href: "#tree" },
    ],
  },
  { value: "changelog", label: "Changelog", href: "#changelog" },
]

const links = new Set(
  pages
    .flatMap((page) => [page, ...(page.children ?? [])])
    .filter((page) => page.href)
    .map((page) => page.value),
)

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
          <TreeItemLabel
            class="flex h-7 min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset not-data-branch:ms-4 text-muted-foreground no-underline data-branch:font-medium data-branch:text-foreground data-current:bg-muted data-current:font-medium data-current:text-foreground"
            render={item.href ? (label) => <a {...label} href={item.href} /> : undefined}
          >
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
  const [current, setCurrent] = createSignal("tree")
  return (
    <Tree
      aria-label="Docs"
      items={pages}
      mode="none"
      current={current()}
      onAction={(value, { event }) => {
        if (!links.has(value)) return
        event?.preventDefault()
        setCurrent(value)
      }}
      class="flex h-80 w-72 max-w-full flex-col overflow-y-auto rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground"
    >
      <Items items={pages} />
    </Tree>
  )
}

export { Example }
