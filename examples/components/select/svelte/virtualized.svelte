<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectList,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"

  const manyItems = Array.from({ length: 10_000 }, (_, index) => ({
    value: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }))

  function visibleRows(scrollTop: number, height: number, count: number, row: number) {
    const start = Math.max(0, Math.floor(scrollTop / row) - 4)
    const end = Math.min(count, Math.ceil((scrollTop + height) / row) + 4)
    return { start, end }
  }

  function scrollForRow(index: number, scrollTop: number, height: number, row: number) {
    const top = index * row
    if (top < scrollTop) return top
    if (top + row > scrollTop + height) return top + row - height
    return scrollTop
  }

  const row = 32
  const height = 288

  let scroller: HTMLDivElement | undefined = $state()
  let scrollTop = $state(0)

  function onHighlight(_value: unknown, { index }: { index: number }) {
    const el = scroller
    if (el && index >= 0) el.scrollTop = scrollForRow(index, el.scrollTop, el.clientHeight, row)
  }

  function visible(items: { value: string; label: string }[]) {
    const { start, end } = visibleRows(scrollTop, height, items.length, row)
    return items.slice(start, end).map((item, offset) => ({ item, index: start + offset }))
  }
</script>

<Select items={manyItems} placeholder="Select an item" {onHighlight}>
  <div data-slot="stack">
    <SelectLabel>Item</SelectLabel>
    <SelectTrigger>
      <SelectValue />
      <ChevronDownIcon />
    </SelectTrigger>
  </div>
  <SelectContent>
    <div
      bind:this={scroller}
      style="height: {height}px"
      onscroll={(event) => (scrollTop = event.currentTarget.scrollTop)}
    >
      <SelectList>
        {#snippet children(state)}
          <div style="height: {state.items.length * row}px">
            {#each visible(state.items as { value: string; label: string }[]) as { item, index } (item.value)}
              <SelectItem
                value={item.value}
                label={item.label}
                {index}
                style="top: {index * row}px; height: {row}px"
              >
                {item.label}
              </SelectItem>
            {/each}
          </div>
        {/snippet}
      </SelectList>
    </div>
  </SelectContent>
</Select>
