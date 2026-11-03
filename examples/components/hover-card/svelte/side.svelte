<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/svelte/hover-card"

  const sides = ["left", "top", "bottom", "right"] as const
  const hrefOf = (side: string) => `https://example.com/${side}`
</script>

<div data-slot="row">
  {#each sides as side (side)}
    <HoverCard>
      <HoverCardTrigger href={hrefOf(side)}>{side}</HoverCardTrigger>
      <HoverCardContent {side}>
        <p>{side}</p>
        <p data-slot="hint">The card opens on this side of the link.</p>
      </HoverCardContent>
    </HoverCard>
  {/each}
</div>
