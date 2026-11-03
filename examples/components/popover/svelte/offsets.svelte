<script lang="ts">
  import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  const choices = {
    sideOffset: [0, 8, 24],
    alignOffset: [-16, 0, 16],
    collisionPadding: [8, 48],
  }
  const names = Object.keys(choices) as (keyof typeof choices)[]
  let offsets = $state({ sideOffset: 8, alignOffset: 0, collisionPadding: 8 })
</script>

<div data-slot="stack">
  <div data-slot="stack">
    {#each names as name (name)}
      <div data-slot="row" role="group" aria-label={name}>
        {#each choices[name] as value (value)}
          <button
            type="button"
            data-size="sm"
            aria-pressed={offsets[name] === value}
            onclick={() => (offsets[name] = value)}
          >
            {name} {value}
          </button>
        {/each}
      </div>
    {/each}
  </div>
  <Popover>
    <PopoverTrigger>Offsets</PopoverTrigger>
    <PopoverContent
      align="start"
      sideOffset={offsets.sideOffset}
      alignOffset={offsets.alignOffset}
      collisionPadding={offsets.collisionPadding}
    >
      <PopoverTitle>Offsets</PopoverTitle>
      <PopoverDescription>
        {offsets.sideOffset}px from the trigger, shifted {offsets.alignOffset}px,
        {offsets.collisionPadding}px from the edges.
      </PopoverDescription>
    </PopoverContent>
  </Popover>
</div>
