<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/svelte/hover-card"

  const grace = {
    handle: "grace",
    name: "Grace Hopper",
    bio: "Built the first compiler and popularized the word “debugging”.",
  }
  let status = $state("Closed")
</script>

<div data-slot="stack">
  <HoverCard
    onOpenChange={(open) => (status = open ? "Opening" : "Closing")}
    onOpenChangeComplete={(open) => (status = open ? "Open" : "Closed")}
  >
    <HoverCardTrigger href="https://example.com/people/grace">@{grace.handle}</HoverCardTrigger>
    <HoverCardContent keepMounted>
      <p>{grace.name}</p>
      <p>{grace.bio}</p>
    </HoverCardContent>
  </HoverCard>
  <output data-slot="output">{status}</output>
</div>
