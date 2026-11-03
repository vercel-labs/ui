<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/svelte/hover-card"

  const ada = {
    handle: "ada",
    name: "Ada Lovelace",
    initials: "AL",
    bio: "Wrote the first published program, for the Analytical Engine.",
  }
  let row: HTMLDivElement | undefined = $state()
</script>

<div data-slot="card" bind:this={row}>
  <div data-slot="avatar" aria-hidden="true">{ada.initials}</div>
  <div data-slot="row">
    <HoverCard>
      <HoverCardTrigger href="https://example.com/people/ada">{ada.name}</HoverCardTrigger>
      <HoverCardContent anchor={row} align="start">
        <p>@{ada.handle}</p>
        <p>{ada.bio}</p>
      </HoverCardContent>
    </HoverCard>
    <span data-slot="hint">committed “Fix the loop”</span>
  </div>
  <span data-slot="hint">2h ago</span>
</div>
