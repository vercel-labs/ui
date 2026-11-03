<script lang="ts">
  import { CircleQuestionMarkIcon } from "@lucide/svelte"
  import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  const sides = ["top", "right", "bottom", "left"] as const
  const aligns = ["start", "center", "end"] as const
  let open = $state(false)
  let pinned = $state(false)
  let side = $state<(typeof sides)[number]>("top")
  let align = $state<(typeof aligns)[number]>("center")

  function onOpenChange(next: boolean, details: { cancel: () => void }) {
    open = next
    if (!next && pinned) {
      details.cancel()
    }
  }
</script>

<div data-slot="stack">
  <div data-slot="stack">
    <div data-slot="grid">
      <span data-slot="hint">side</span>
      <div data-slot="row" role="group" aria-label="side">
        {#each sides as value (value)}
          <button type="button" data-size="sm" aria-pressed={side === value} onclick={() => (side = value)}>
            {value}
          </button>
        {/each}
      </div>
      <span data-slot="hint">align</span>
      <div data-slot="row" role="group" aria-label="align">
        {#each aligns as value (value)}
          <button type="button" data-size="sm" aria-pressed={align === value} onclick={() => (align = value)}>
            {value}
          </button>
        {/each}
      </div>
    </div>
    <label data-slot="label">
      <input bind:checked={pinned} type="checkbox" />
      Keep open
    </label>
  </div>
  <Tooltip open={pinned || open} {onOpenChange}>
    <TooltipTrigger>
      <CircleQuestionMarkIcon />
    </TooltipTrigger>
    <TooltipContent {side} {align} sideOffset={8} arrowPadding={8}>
      <TooltipArrow />
      Keyboard shortcuts
    </TooltipContent>
  </Tooltip>
</div>
