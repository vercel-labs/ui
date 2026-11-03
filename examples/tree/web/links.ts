import type { TreeItemData } from "@ui-sdk/core/tree"
import "@ui-sdk/web/tree"

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

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tree aria-label="Docs" mode="none" current="tree" class="flex h-80 w-72 max-w-full flex-col overflow-y-auto rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground">
      <template>
        <ui-tree-item class="flex flex-wrap items-center outline-none">
          <ui-tree-item-indicator class="flex size-4 cursor-default shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200 data-expanded:rotate-90 rtl:rotate-180 rtl:data-expanded:rotate-90 before:content-['›']"></ui-tree-item-indicator>
          <ui-tree-item-label class="flex h-7 min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset not-data-branch:ms-4 text-muted-foreground no-underline data-branch:font-medium data-branch:text-foreground data-current:bg-muted data-current:font-medium data-current:text-foreground"></ui-tree-item-label>
          <ui-tree-group class="h-(--tree-group-height) overflow-hidden ps-4 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 basis-full"></ui-tree-group>
        </ui-tree-item>
      </template>
    </ui-tree>
  `
  const tree = root.querySelector("ui-tree")!
  tree.items = pages
  tree.addEventListener("action", (event) => {
    const detail = event.detail
    if (!links.has(detail.value)) return
    detail.event?.preventDefault()
    tree.setAttribute("current", detail.value)
  })
}

export { mount }
