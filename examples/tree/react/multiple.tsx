"use client"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/react/tree"
import * as React from "react"

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

function Items({ items }: { items: TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value} className="flex flex-wrap items-center outline-none">
      {item.children && (
        <TreeItemIndicator className="flex size-4 cursor-default shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200 data-expanded:rotate-90 rtl:rotate-180 rtl:data-expanded:rotate-90 before:content-['›']" />
      )}
      <TreeItemLabel className="flex h-7 min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset flex-1 not-data-branch:ms-4">
        {item.label}
      </TreeItemLabel>
      {item.children && (
        <TreeGroup className="h-(--tree-group-height) overflow-hidden ps-4 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 basis-full">
          <Items items={item.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function Example() {
  const [value, setValue] = React.useState(["updates", "website"])
  return (
    <div className="flex w-72 max-w-full flex-col gap-3">
      <Tree
        aria-label="Folders"
        items={items}
        mode="multiple"
        value={value}
        onValueChange={setValue}
        expandOnPress={false}
        defaultExpanded={["inbox", "projects"]}
        className="flex h-80 w-full flex-col overflow-y-auto rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground"
      >
        <Items items={items} />
      </Tree>
      <p className="m-0 block min-h-10 text-sm leading-5 text-muted-foreground">{value.length} selected</p>
    </div>
  )
}

export { Example }
