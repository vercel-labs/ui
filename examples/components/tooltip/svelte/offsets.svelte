<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  const aligns = ["start", "center", "end"] as const
  const sideOffsets = [4, 12, 24]
  const alignOffsets = [-16, 0, 16]
  const paddings = [8, 48]
  let align = $state<(typeof aligns)[number]>("start")
  let sideOffset = $state(4)
  let alignOffset = $state(0)
  let collisionPadding = $state(8)
</script>

<div data-slot="stack">
  <div data-slot="grid">
    <span data-slot="hint">align</span>
    <div data-slot="row" role="group" aria-label="align">
      {#each aligns as value (value)}
        <button type="button" data-size="sm" aria-pressed={align === value} onclick={() => (align = value)}>
          {value}
        </button>
      {/each}
    </div>
    <span data-slot="hint">sideOffset</span>
    <div data-slot="row" role="group" aria-label="sideOffset">
      {#each sideOffsets as value (value)}
        <button
          type="button"
          data-size="sm"
          aria-pressed={sideOffset === value}
          onclick={() => (sideOffset = value)}
        >
          {value}
        </button>
      {/each}
    </div>
    <span data-slot="hint">alignOffset</span>
    <div data-slot="row" role="group" aria-label="alignOffset">
      {#each alignOffsets as value (value)}
        <button
          type="button"
          data-size="sm"
          aria-pressed={alignOffset === value}
          onclick={() => (alignOffset = value)}
        >
          {value}
        </button>
      {/each}
    </div>
    <span data-slot="hint">collisionPadding</span>
    <div data-slot="row" role="group" aria-label="collisionPadding">
      {#each paddings as value (value)}
        <button
          type="button"
          data-size="sm"
          aria-pressed={collisionPadding === value}
          onclick={() => (collisionPadding = value)}
        >
          {value}
        </button>
      {/each}
    </div>
  </div>
  <Tooltip>
    <TooltipTrigger>Offsets</TooltipTrigger>
    <TooltipContent {align} {sideOffset} {alignOffset} {collisionPadding}>
      {align}, {sideOffset}px away, shifted {alignOffset}px
    </TooltipContent>
  </Tooltip>
</div>
