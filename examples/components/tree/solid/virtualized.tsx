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
      data-slot="scroll"
      ref={scroller}
      style={{ height: `${height}px` }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <Tree
        aria-label="Archive"
        items={items}
        expanded={expanded()}
        onExpandedChange={setExpanded}
        onItemFocus={(_value, { index }) => {
          const el = scroller
          if (!el) return
          const top = index * row
          if (top < el.scrollTop) el.scrollTop = top
          else if (top + row > el.scrollTop + el.clientHeight - 8)
            el.scrollTop = top + row - el.clientHeight + 8
          setScrollTop(el.scrollTop)
        }}
        style={{ height: `${rows().length * row}px` }}
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
            >
              <TreeItemLabel>
                <span data-slot="hint" aria-hidden="true">
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
