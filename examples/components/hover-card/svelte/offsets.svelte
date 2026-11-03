<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/svelte/hover-card"

  const sideOffsets = [4, 12, 24]
  const alignOffsets = [-16, 0, 16]
  const paddings = [8, 48]
  let sideOffset = $state(4)
  let alignOffset = $state(0)
  let collisionPadding = $state(8)
</script>

<div data-slot="stack">
  <div data-slot="grid">
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
  <HoverCard>
    <HoverCardTrigger href="https://example.com/offsets">Offsets</HoverCardTrigger>
    <HoverCardContent align="start" {sideOffset} {alignOffset} {collisionPadding}>
      <p>Offsets</p>
      <p data-slot="hint">
        {sideOffset}px from the link, shifted {alignOffset}px, {collisionPadding}px from the edges.
      </p>
    </HoverCardContent>
  </HoverCard>
</div>
