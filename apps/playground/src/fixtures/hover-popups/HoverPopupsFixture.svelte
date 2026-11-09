<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@ui-sdk/svelte"
  import {
    describeChange,
    hoverPopupsFixture as fixture,
  } from "tests/fixtures/hover-popups.ts"

  let change = $state("")

  function opened(component: string, open: boolean, { event }: ChangeDetails) {
    if (open) {
      change = describeChange(component, "open", event)
    }
  }

  function payloadChanged(
    component: string,
    payload: unknown,
    { event }: ChangeDetails
  ) {
    change = describeChange(component, `payload ${payload}`, event)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Tooltip
    delay={0}
    onOpenChange={(open, details) => opened("tooltip", open, details)}
    onPayloadChange={(payload, details) =>
      payloadChanged("tooltip", payload, details)}
  >
    {#each fixture.days as day (day)}
      <TooltipTrigger payload={day.toLowerCase()}>{day}</TooltipTrigger>
    {/each}
    <TooltipContent class="tooltip">
      {#snippet children(state)}Tip for {state.payload}{/snippet}
    </TooltipContent>
  </Tooltip>
  <HoverCard
    delay={0}
    closeDelay={0}
    onOpenChange={(open, details) => opened("hover card", open, details)}
    onPayloadChange={(payload, details) =>
      payloadChanged("hover card", payload, details)}
  >
    {#each fixture.people as person (person)}
      <HoverCardTrigger href={`#${person}`} payload={person.toLowerCase()}
        >{person}</HoverCardTrigger
      >
    {/each}
    <HoverCardContent class="hover-card">
      {#snippet children(state)}Card for {state.payload}{/snippet}
    </HoverCardContent>
  </HoverCard>
  <Popover
    openOnHover
    delay={0}
    closeDelay={0}
    onOpenChange={(open, details) => opened("popover", open, details)}
  >
    <PopoverTrigger>{fixture.popover.trigger}</PopoverTrigger>
    <PopoverContent class="popup">{fixture.popover.content}</PopoverContent>
  </Popover>
  <output role="status" aria-label="Last change">{change}</output>
</div>
