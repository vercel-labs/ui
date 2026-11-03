import { visibleTreeRows, type TreeItemData } from "@ui-sdk/core/tree"
import "@ui-sdk/web/tree"

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

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div style="height: ${height}px" class="w-72 max-h-[min(20rem,60dvh)] max-w-full overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground">
      <ui-tree aria-label="Archive" default-expanded="folder-1" class="relative"></ui-tree>
    </div>
  `
  const scroller = root.querySelector("div")!
  const tree = root.querySelector("ui-tree")!

  let expanded = ["folder-1"]
  let rows = visibleTreeRows(items, expanded)

  const rendered = new Map<string, HTMLElement>()
  const render = () => {
    tree.style.height = `${rows.length * row}px`
    const start = Math.max(0, Math.floor(scroller.scrollTop / row) - 4)
    const end = Math.min(rows.length, Math.ceil((scroller.scrollTop + height) / row) + 4)
    const visible = new Map(rows.slice(start, end).map((entry) => [entry.item.value, entry]))
    for (const [value, el] of rendered) {
      if (visible.has(value)) continue
      el.remove()
      rendered.delete(value)
    }
    for (const [value, { item, level, index }] of visible) {
      let el = rendered.get(value)
      if (!el) {
        tree.insertAdjacentHTML(
          "beforeend",
          `<ui-tree-item value="${item.value}" class="absolute inset-x-0 outline-none">
            <ui-tree-item-label class="flex h-full min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset">
              <span aria-hidden="true" class="w-3 shrink-0 text-muted-foreground"></span>
              ${item.label}
            </ui-tree-item-label>
          </ui-tree-item>`,
        )
        el = tree.lastElementChild as HTMLElement
        rendered.set(value, el)
      }
      el.style.cssText = `top: ${index * row}px; height: ${row}px; padding-inline-start: ${(level - 1) * 16}px`
      el.querySelector("span")!.textContent = item.children ? (expanded.includes(value) ? "▾" : "▸") : ""
    }
  }
  render()
  tree.items = items
  scroller.addEventListener("scroll", render)
  tree.addEventListener("expandedchange", (event) => {
    expanded = event.detail.value
    rows = visibleTreeRows(items, expanded)
    render()
  })
  tree.addEventListener("highlight", (event) => {
    const { index } = event.detail
    const top = index * row
    if (top < scroller.scrollTop) scroller.scrollTop = top
    else if (top + row > scroller.scrollTop + scroller.clientHeight - 8)
      scroller.scrollTop = top + row - scroller.clientHeight + 8
    render()
  })
}

export { mount }
