<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardTrigger,
  } from "@ui-sdk/svelte"
  import {
    hoverCardContentOptions,
    hoverCardFixture as fixture,
    hoverCardOptions,
  } from "tests/fixtures/hover-card.ts"

  const options = hoverCardOptions()
  const content = hoverCardContentOptions()
  let action = $state("")

  function report(open: boolean, { reason }: ChangeDetails) {
    action = `${open ? "open" : "close"}: ${reason}`
  }
</script>

<div class="fixture">
  <button>Before</button>
  <HoverCard {...options} onOpenChange={report}>
    <HoverCardTrigger href={fixture.href}>{fixture.trigger}</HoverCardTrigger>
    <HoverCardContent class="hover-card" {...content}>
      <HoverCardArrow class="arrow" />
      <p>
        <strong>{fixture.name}</strong>
      </p>
      <p>{fixture.bio}</p>
      <a href={fixture.linkHref}>{fixture.link}</a>
    </HoverCardContent>
  </HoverCard>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
