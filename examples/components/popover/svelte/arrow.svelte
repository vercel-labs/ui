<script lang="ts">
  import { CircleQuestionMarkIcon } from "@lucide/svelte"
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
  let open = $state(false)
  let side = $state<(typeof sides)[number]>("bottom")
  let align = $state<(typeof aligns)[number]>("start")
  let controls: HTMLDivElement | undefined = $state()

  function onOpenChange(next: boolean, details: { event?: Event; cancel: () => void }) {
    const target = details.event?.target
    if (!next && target instanceof Node && controls?.contains(target)) return details.cancel()
    open = next
  }
</script>

<div data-slot="stack">
  <div data-slot="stack" bind:this={controls}>
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
  <Popover {open} {onOpenChange}>
    <PopoverTrigger aria-label="Help">
      <CircleQuestionMarkIcon aria-hidden="true" />
    </PopoverTrigger>
    <PopoverContent {side} {align} sideOffset={10} arrowPadding={12}>
      <PopoverArrow />
      <PopoverTitle>Keyboard shortcuts</PopoverTitle>
      <PopoverDescription>Press ? anywhere to see every shortcut.</PopoverDescription>
    </PopoverContent>
  </Popover>
</div>
