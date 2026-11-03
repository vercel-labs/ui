<script lang="ts">
  import { Tree, TreeItem, TreeItemLabel, visibleTreeRows, type TreeItemData } from "@ui-sdk/svelte/tree"

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

  let scroller: HTMLDivElement | undefined = $state()
  let scrollTop = $state(0)
  let expanded = $state(["folder-1"])
  const rows = $derived(visibleTreeRows(items, expanded))
  const start = $derived(Math.max(0, Math.floor(scrollTop / row) - 4))
  const end = $derived(Math.min(rows.length, Math.ceil((scrollTop + height) / row) + 4))

  function onHighlight(_value: string, { index }: { index: number }) {
    const el = scroller
    if (!el) return
    const top = index * row
    if (top < el.scrollTop) el.scrollTop = top
    else if (top + row > el.scrollTop + el.clientHeight - 8) el.scrollTop = top + row - el.clientHeight + 8
    scrollTop = el.scrollTop
  }
</script>

<div
  bind:this={scroller}
  style="height: {height}px"
  class="w-72 max-h-[min(20rem,60dvh)] max-w-full overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background p-1 text-sm leading-5 text-foreground"
  onscroll={(event) => (scrollTop = event.currentTarget.scrollTop)}
>
  <Tree
    aria-label="Archive"
    {items}
    bind:expanded
    {onHighlight}
    style="height: {rows.length * row}px"
    class="relative"
  >
    {#each rows.slice(start, end) as { item, level, index } (item.value)}
      <TreeItem
        value={item.value}
        style="top: {index * row}px; height: {row}px; padding-inline-start: {(level - 1) * 16}px"
        class="absolute inset-x-0 outline-none"
      >
        <TreeItemLabel
          class="flex h-full min-w-0 cursor-default items-center gap-1.5 rounded-xl px-2 text-sm leading-5 select-none hover:bg-muted data-disabled:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset"
        >
          <span aria-hidden="true" class="w-3 shrink-0 text-muted-foreground">
            {#if item.children}{expanded.includes(item.value) ? "▾" : "▸"}{/if}
          </span>
          {item.label}
        </TreeItemLabel>
      </TreeItem>
    {/each}
  </Tree>
</div>
