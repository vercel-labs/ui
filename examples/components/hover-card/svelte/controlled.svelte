<script lang="ts">
  import {
    createHoverCardController,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@ui-sdk/svelte/hover-card"

  const grace = {
    handle: "grace",
    name: "Grace Hopper",
    bio: "Built the first compiler and popularized the word “debugging”.",
  }
  const card = createHoverCardController()
  let open = $state(false)
  let reason = $state("")
</script>

<div data-slot="stack">
  <div data-slot="row">
    <HoverCard bind:open controller={card} onOpenChange={(_, details) => (reason = details.reason)}>
      <HoverCardTrigger href="https://example.com/people/grace">@{grace.handle}</HoverCardTrigger>
      <HoverCardContent>
        <p>{grace.name}</p>
        <p>{grace.bio}</p>
      </HoverCardContent>
    </HoverCard>
    <button type="button" onclick={() => card.open()}>
      Show from elsewhere
    </button>
  </div>
  <output data-slot="output">{open ? "Open" : "Closed"}{reason ? `, last change: ${reason}` : ""}</output>
</div>
