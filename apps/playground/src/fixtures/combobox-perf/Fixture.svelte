<script lang="ts">
  import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
  } from "@ui-sdk/svelte"
  import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

  // A long combobox for the counts specs. Every other option
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
  <Combobox>
    <ComboboxInput aria-label="Search" class="input" />
    <ComboboxContent class="popup list-popup">
      <ComboboxList>
        {#each items as item, index (item.value)}
          {#if index % 2}
            <ComboboxItem class="item" value={item.value} label={item.label}>
              {#snippet render({ props, state })}
                <div {...props}>
                  {count("watched", props, state.highlighted)}{state.highlighted
                    ? "→ "
                    : ""}{item.label}
                </div>
              {/snippet}
            </ComboboxItem>
          {:else}
            <ComboboxItem class="item" value={item.value} label={item.label}>
              {#snippet render({ props })}
                <div {...props}>{count("plain", props)}{item.label}</div>
              {/snippet}
            </ComboboxItem>
          {/if}
        {/each}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <button>After</button>
</div>
