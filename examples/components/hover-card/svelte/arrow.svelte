<script lang="ts">
  import { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger } from "@ui-sdk/svelte/hover-card"

  const sides = ["top", "right", "bottom", "left"] as const
  const aligns = ["start", "center", "end"] as const
  const alan = {
    handle: "alan",
    name: "Alan Turing",
    bio: "Described the universal machine every computer descends from.",
  }
  let side = $state<(typeof sides)[number]>("bottom")
  let align = $state<(typeof aligns)[number]>("center")
</script>

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
  <HoverCard>
    <HoverCardTrigger href="https://example.com/people/alan">@{alan.handle}</HoverCardTrigger>
    <HoverCardContent {side} {align} sideOffset={10} arrowPadding={12}>
      <HoverCardArrow />
      <p>{alan.name}</p>
      <p>{alan.bio}</p>
    </HoverCardContent>
  </HoverCard>
</div>
