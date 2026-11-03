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

  function onItemFocus(_value: string, { index }: { index: number }) {
    const el = scroller
    if (!el) return
    const top = index * row
    if (top < el.scrollTop) el.scrollTop = top
    else if (top + row > el.scrollTop + el.clientHeight - 8) el.scrollTop = top + row - el.clientHeight + 8
    scrollTop = el.scrollTop
  }
</script>

<div data-slot="scroll"
  bind:this={scroller}
  style="height: {height}px"
  onscroll={(event) => (scrollTop = event.currentTarget.scrollTop)}
>
  <Tree aria-label="Archive" {items} bind:expanded {onItemFocus} style="height: {rows.length * row}px">
    {#each rows.slice(start, end) as { item, level, index } (item.value)}
      <TreeItem
        value={item.value}
        style="top: {index * row}px; height: {row}px; padding-inline-start: {(level - 1) * 16}px"
      >
        <TreeItemLabel>
          <span data-slot="hint" aria-hidden="true">
            {#if item.children}{expanded.includes(item.value) ? "▾" : "▸"}{/if}
          </span>
          {item.label}
        </TreeItemLabel>
      </TreeItem>
    {/each}
  </Tree>
</div>
