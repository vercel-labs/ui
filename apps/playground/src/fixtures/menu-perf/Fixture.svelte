<script lang="ts">
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuItem,
    MenuItemIndicator,
    MenuTrigger,
  } from "@ui-sdk/svelte"
  import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

  // A long menu for the counts specs. Every other item reads `highlighted` in
  // its render snippet, so specs can tell plain items' updates from watched
  // ones. An update is the part's props changing, which the text reads so it
  // counts them, or a state key it read. A checkbox item at the end changes
  // state that only it and its indicator show.
  const items = perfItems(perfSize())
  const count = (
    kind: "watched" | "plain" | "checkbox",
    ...reads: unknown[]
  ) => (countRender(kind), "")
</script>

<div class="fixture">
  <button>Before</button>
  <Menu>
    <MenuTrigger>File</MenuTrigger>
    <MenuContent class="popup" style="max-height: 320px; overflow: auto">
      {#each items as item, index (item.value)}
        {#if index % 2}
          <MenuItem class="item" value={item.value}>
            {#snippet render({ props, state })}
              <div {...props}>
                {count("watched", props, state.highlighted)}{state.highlighted
                  ? "→ "
                  : ""}{item.label}
              </div>
            {/snippet}
          </MenuItem>
        {:else}
          <MenuItem class="item" value={item.value}>
            {#snippet render({ props })}
              <div {...props}>{count("plain", props)}{item.label}</div>
            {/snippet}
          </MenuItem>
        {/if}
      {/each}
      <MenuCheckboxItem class="item" value="wrap">
        {#snippet render({ props })}
          <div {...props}>
            {count("checkbox", props)}<MenuItemIndicator>✓</MenuItemIndicator
            >Wrap lines
          </div>
        {/snippet}
      </MenuCheckboxItem>
    </MenuContent>
  </Menu>
  <button>After</button>
</div>
