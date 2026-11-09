"use client"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  treeFromPaths,
} from "@ui-sdk/react/tree"
import type { TreeItemData } from "@ui-sdk/react/tree"
import { ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"
import type { Root } from "@/lib/files"

function ancestors(file: string) {
  const parts = file.split("/")
  return parts.slice(1).map((_, index) => parts.slice(0, index + 1).join("/"))
}

function Items({ items }: { items: TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value} className="outline-none">
      <TreeItemLabel className="flex h-7 min-w-0 cursor-default items-center gap-1 rounded-lg px-1.5 text-[13px] select-none hover:bg-muted data-selected:bg-accent data-selected:font-medium [:focus-visible>&]:ring-2 [:focus-visible>&]:ring-ring/40 [:focus-visible>&]:ring-inset">
        {item.children ? (
          <TreeItemIndicator className="flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-150 data-expanded:rotate-90 rtl:rotate-180 rtl:data-expanded:rotate-90">
            <ChevronRight aria-hidden="true" className="size-3.5" />
          </TreeItemIndicator>
        ) : (
          <span className="size-4 shrink-0" />
        )}
        <span className="truncate">{item.label}</span>
      </TreeItemLabel>
      {item.children && (
        <TreeGroup className="h-(--tree-group-height) overflow-hidden ps-3 transition-[height] duration-150 ease-out data-starting-style:h-0 data-ending-style:h-0">
          <Items items={item.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function FileTree({
  roots,
  files,
  file,
  onOpen,
}: {
  roots: Root[]
  files: string[]
  file: string
  onOpen: (file: string) => void
}) {
  const items = useMemo(() => {
    const byName = new Map(
      treeFromPaths(files).map((item) => [item.value, item])
    )
    return roots.flatMap((root) => {
      const item = byName.get(root.name)
      return item ? [{ ...item, label: root.label }] : []
    })
  }, [roots, files])
  const known = useMemo(() => new Set(files), [files])
  const [expanded, setExpanded] = useState(() => ["app", ...ancestors(file)])
  const [opened, setOpened] = useState(file)
  const [selected, setSelected] = useState(file)

  if (opened !== file) {
    setOpened(file)
    setSelected(file)
    setExpanded((current) => [...new Set([...current, ...ancestors(file)])])
  }

  return (
    <Tree
      aria-label="Files"
      items={items}
      value={selected}
      onValueChange={(value) => {
        if (!value || !known.has(value)) {
          return
        }
        setSelected(value)
        onOpen(value)
      }}
      expanded={expanded}
      onExpandedChange={setExpanded}
      activation="automatic"
      className="flex flex-col p-1.5"
    >
      <Items items={items} />
    </Tree>
  )
}

export { FileTree }
