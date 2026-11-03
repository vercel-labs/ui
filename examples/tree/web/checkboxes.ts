import type { TreeItemData } from "@ui-sdk/core/tree"
import "@ui-sdk/web/tree"

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

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex w-72 max-w-full flex-col gap-3">
      <ui-tree aria-label="Stack" checkable mode="none" check-strategy="trunk" default-checked="react,postgres" default-expanded="frontend,backend,databases" class="flex h-80 w-full flex-col overflow-y-auto rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground">
        <template>
          <ui-tree-item class="flex flex-wrap items-center outline-none">
            <ui-tree-item-checkbox class="relative ms-2 flex size-4 cursor-default shrink-0 items-center justify-center rounded-[5px] border border-input bg-background after:text-[10px] after:leading-none after:text-primary-foreground data-checked:border-primary data-checked:bg-primary data-checked:after:content-['✓'] data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:after:content-['–']"></ui-tree-item-checkbox>
            <ui-tree-item-label class="flex h-7 min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset flex-1"></ui-tree-item-label>
            <ui-tree-group class="h-(--tree-group-height) overflow-hidden ps-6 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 basis-full"></ui-tree-group>
          </ui-tree-item>
        </template>
      </ui-tree>
      <p class="m-0 block min-h-10 text-sm leading-5 text-muted-foreground">Checked: react, postgres</p>
    </div>
  `
  const tree = root.querySelector("ui-tree")!
  const output = root.querySelector("p")!
  tree.items = items
  tree.addEventListener("checkedchange", (event) => {
    const checked = event.detail.value
    output.textContent = `Checked: ${checked.join(", ") || "nothing"}`
  })
}

export { mount }
