<script lang="ts">
  import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/svelte/menu"

  const sides = ["top", "right", "bottom", "left"] as const
  const aligns = ["start", "center", "end"] as const

  let side = $state<(typeof sides)[number]>("bottom")
  let align = $state<(typeof aligns)[number]>("start")
</script>

<div data-slot="stack">
  <div data-slot="stack">
    <div data-slot="row" role="group" aria-label="Side">
      {#each sides as value (value)}
        <button data-size="sm" aria-pressed={side === value} onclick={() => side = value}>
          {value}
        </button>
      {/each}
    </div>
    <div data-slot="row" role="group" aria-label="Align">
      {#each aligns as value (value)}
        <button data-size="sm" aria-pressed={align === value} onclick={() => align = value}>
          {value}
        </button>
      {/each}
    </div>
  </div>
  <Menu>
    <MenuTrigger>Placement</MenuTrigger>
    <MenuContent {side} {align}>
      <MenuItem>Cut</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuItem>Paste</MenuItem>
    </MenuContent>
  </Menu>
</div>
