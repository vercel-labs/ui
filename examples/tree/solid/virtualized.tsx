import { Tree, TreeItem, TreeItemLabel, visibleTreeRows, type TreeItemData } from "@ui-sdk/solid/tree"
import { createMemo, createSignal, For } from "solid-js"

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
  let scroller: HTMLDivElement | undefined
  const [scrollTop, setScrollTop] = createSignal(0)
  const [expanded, setExpanded] = createSignal(["folder-1"])
  const rows = createMemo(() => visibleTreeRows(items, expanded()))
  const start = () => Math.max(0, Math.floor(scrollTop() / row) - 4)
  const end = () => Math.min(rows().length, Math.ceil((scrollTop() + height) / row) + 4)
  return (
    <div
      ref={scroller}
      style={{ height: `${height}px` }}
      class="w-72 max-h-[min(20rem,60dvh)] max-w-full overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground"
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <Tree
        aria-label="Archive"
        items={items}
        expanded={expanded()}
        onExpandedChange={setExpanded}
        onHighlight={(_value, { index }) => {
          const el = scroller
          if (!el) return
          const top = index * row
          if (top < el.scrollTop) el.scrollTop = top
          else if (top + row > el.scrollTop + el.clientHeight - 8)
            el.scrollTop = top + row - el.clientHeight + 8
          setScrollTop(el.scrollTop)
        }}
        style={{ height: `${rows().length * row}px` }}
        class="relative"
      >
        <For each={rows().slice(start(), end())} keyed={(visible) => visible.item.value}>
          {(visible) => (
            <TreeItem
              value={visible().item.value}
              style={{
                top: `${visible().index * row}px`,
                height: `${row}px`,
                "padding-inline-start": `${(visible().level - 1) * 16}px`,
              }}
              class="absolute inset-x-0 outline-none"
            >
              <TreeItemLabel class="flex h-full min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset">
                <span aria-hidden="true" class="w-3 shrink-0 text-muted-foreground">
                  {visible().item.children && (expanded().includes(visible().item.value) ? "▾" : "▸")}
                </span>
                {visible().item.label}
              </TreeItemLabel>
            </TreeItem>
          )}
        </For>
      </Tree>
    </div>
  )
}

export { Example }
