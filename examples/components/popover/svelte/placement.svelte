<script lang="ts">
  import {
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  const sides = ["top", "right", "bottom", "left"] as const
  const aligns = ["start", "center", "end"] as const
  let side = $state<(typeof sides)[number]>("bottom")
  let align = $state<(typeof aligns)[number]>("center")
  let sideOffset = $state(8)
  let alignOffset = $state(0)
  let collisionPadding = $state(8)
</script>

<div data-slot="stack">
  <div data-slot="stack">
    <div data-slot="row" role="group" aria-label="Side">
      {#each sides as value (value)}
        <button type="button" data-size="sm" aria-pressed={side === value} onclick={() => (side = value)}>
          {value}
        </button>
      {/each}
    </div>
    <div data-slot="row" role="group" aria-label="Align">
      {#each aligns as value (value)}
        <button type="button" data-size="sm" aria-pressed={align === value} onclick={() => (align = value)}>
          {value}
        </button>
      {/each}
    </div>
  </div>
  <div data-slot="stack">
    <label data-slot="label">
      Side offset
      <span data-slot="hint">{sideOffset}px</span>
      <input bind:value={sideOffset} type="range" min={0} max={32} />
    </label>
    <label data-slot="label">
      Align offset
      <span data-slot="hint">{alignOffset}px</span>
      <input bind:value={alignOffset} type="range" min={-24} max={24} />
    </label>
    <label data-slot="label">
      Collision padding
      <span data-slot="hint">{collisionPadding}px</span>
      <input bind:value={collisionPadding} type="range" min={0} max={48} />
    </label>
  </div>
  <Popover>
    <PopoverTrigger>Placement</PopoverTrigger>
    <PopoverContent {side} {align} {sideOffset} {alignOffset} {collisionPadding}>
      <PopoverArrow />
      <PopoverTitle>{side} {align}</PopoverTitle>
      <PopoverDescription>Choose a side, alignment, and offsets above.</PopoverDescription>
    </PopoverContent>
  </Popover>
</div>
