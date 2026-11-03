<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/svelte/hover-card"

  let container: HTMLDivElement | undefined = $state()
</script>

<div data-slot="stack">
  <HoverCard>
    <HoverCardTrigger href="https://example.com/box">Show in the box</HoverCardTrigger>
    <HoverCardContent {container}>
      <p>Portaled</p>
      <p data-slot="hint">This card is in the box below, in the DOM.</p>
    </HoverCardContent>
  </HoverCard>
  <div data-slot="card">
    Container
    <div bind:this={container}></div>
  </div>
</div>
