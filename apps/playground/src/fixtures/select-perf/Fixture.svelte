<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte"
  import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

  // A long select for the counts specs. Every other option
  // reads `highlighted` in its render snippet, so specs can tell plain
  // options' updates from watched ones. An update is the part's props
  // changing, which the text reads so it counts them, or a state key it read.
  const items = perfItems(perfSize())
  const count = (kind: "watched" | "plain", ...reads: unknown[]) => (
    countRender(kind),
    ""
  )
</script>

<div class="fixture">
  <button>Before</button>
  <Select defaultValue={items[0].value}>
    <SelectTrigger aria-label="Pick" class="trigger">
      <SelectValue />
    </SelectTrigger>
    <SelectContent class="popup list-popup">
      {#each items as item, index (item.value)}
        {#if index % 2}
          <SelectItem class="item" value={item.value} label={item.label}>
            {#snippet render({ props, state })}
              <div {...props}>
                {count("watched", props, state.highlighted)}{state.highlighted
                  ? "→ "
                  : ""}{item.label}
              </div>
            {/snippet}
          </SelectItem>
        {:else}
          <SelectItem class="item" value={item.value} label={item.label}>
            {#snippet render({ props })}
              <div {...props}>{count("plain", props)}{item.label}</div>
            {/snippet}
          </SelectItem>
        {/if}
      {/each}
    </SelectContent>
  </Select>
  <button>After</button>
</div>
