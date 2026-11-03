"use client"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/react/tree"
import * as React from "react"

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

function Items({ items }: { items: TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value} className="flex flex-wrap items-center outline-none">
      <TreeItemCheckbox className="relative ms-2 flex size-4 cursor-default shrink-0 items-center justify-center rounded-[5px] border border-input bg-background after:text-[10px] after:leading-none after:text-primary-foreground data-checked:border-primary data-checked:bg-primary data-checked:after:content-['✓'] data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:after:content-['–']" />
      <TreeItemLabel className="flex h-7 min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset flex-1">
        {item.label}
      </TreeItemLabel>
      {item.children && (
        <TreeGroup className="h-(--tree-group-height) overflow-hidden ps-6 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 basis-full">
          <Items items={item.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function Example() {
  const [checked, setChecked] = React.useState(initial)
  return (
    <div className="flex w-72 max-w-full flex-col gap-3">
      <Tree
        aria-label="Stack"
        items={items}
        checkable
        mode="none"
        checkStrategy="trunk"
        defaultChecked={initial}
        onCheckedChange={setChecked}
        defaultExpanded={["frontend", "backend", "databases"]}
        className="flex h-80 w-full flex-col overflow-y-auto rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground"
      >
        <Items items={items} />
      </Tree>
      <p className="m-0 block min-h-10 text-sm leading-5 text-muted-foreground">
        Checked: {checked.join(", ") || "nothing"}
      </p>
    </div>
  )
}

export { Example }
