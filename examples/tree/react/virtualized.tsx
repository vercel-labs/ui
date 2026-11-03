"use client"

import { Tree, TreeItem, TreeItemLabel, visibleTreeRows, type TreeItemData } from "@ui-sdk/react/tree"
import * as React from "react"

const items: TreeItemData[] = Array.from({ length: 100 }, (_, folder) => ({
  value: `folder-${folder + 1}`,
  label: `Folder ${folder + 1}`,
  children: Array.from({ length: 100 }, (_, file) => ({
    value: `folder-${folder + 1}/file-${file + 1}`,
    label: `File ${file + 1}.txt`,
  })),
}))

const row = 28
const height = 280

function Example() {
  const scroller = React.useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = React.useState(0)
  const [expanded, setExpanded] = React.useState(["folder-1"])
  const rows = React.useMemo(() => visibleTreeRows(items, expanded), [expanded])
  const start = Math.max(0, Math.floor(scrollTop / row) - 4)
  const end = Math.min(rows.length, Math.ceil((scrollTop + height) / row) + 4)
  return (
    <div
      ref={scroller}
      style={{ height }}
      className="w-72 max-h-[min(20rem,60dvh)] max-w-full overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground"
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <Tree
        aria-label="Archive"
        items={items}
        expanded={expanded}
        onExpandedChange={setExpanded}
        onHighlight={(_value, { index }) => {
          const el = scroller.current
          if (!el) return
          const top = index * row
          if (top < el.scrollTop) el.scrollTop = top
          else if (top + row > el.scrollTop + el.clientHeight - 8)
            el.scrollTop = top + row - el.clientHeight + 8
          setScrollTop(el.scrollTop)
        }}
        style={{ height: rows.length * row }}
        className="relative"
      >
        {rows.slice(start, end).map(({ item, level, index }) => (
          <TreeItem
            key={item.value}
            value={item.value}
            style={{ top: index * row, height: row, paddingInlineStart: (level - 1) * 16 }}
            className="absolute inset-x-0 outline-none"
          >
            <TreeItemLabel className="flex h-full min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset">
              <span aria-hidden className="w-3 shrink-0 text-muted-foreground">
                {item.children && (expanded.includes(item.value) ? "▾" : "▸")}
              </span>
              {item.label}
            </TreeItemLabel>
          </TreeItem>
        ))}
      </Tree>
    </div>
  )
}

export { Example }
