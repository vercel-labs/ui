<script lang="ts">
  import { createCollapsibleController } from "@ui-sdk/core/collapsible"
  import {
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
  } from "@ui-sdk/svelte"
  import { collapsibleFixture as fixture } from "tests/fixtures/collapsible.ts"
  import { collapsibleOptions } from "tests/fixtures/page.ts"

  const controller = createCollapsibleController()
  const { cancel, keepMounted, hiddenUntilFound, ...options } =
    collapsibleOptions()

  let action = $state("")
  let reason = $state("")
  let source = $state("")
  let complete = $state("")

  function onOpenChange(
    open: boolean,
    details: { reason: string; source: string; cancel: () => void }
  ) {
    if (cancel === (open ? "open" : "close")) {
      return details.cancel()
    }
    action = open ? "open" : "closed"
    reason = details.reason
    source = details.source
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Collapsible
    class="collapsible"
    {...options}
    {controller}
    {onOpenChange}
    onOpenChangeComplete={(open) => (complete = open ? "open" : "closed")}
  >
    <CollapsibleTrigger class="collapsible-trigger"
      >{fixture.trigger}</CollapsibleTrigger
    >
    <CollapsiblePanel
      class="collapsible-panel"
      {keepMounted}
      {hiddenUntilFound}
    >
      <p>{fixture.content}</p>
      <label>{fixture.field} <input /></label>
      <button onclick={() => controller.close()}>{fixture.close}</button>
    </CollapsiblePanel>
  </Collapsible>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Last reason">{reason}</output>
  <output aria-label="Last source">{source}</output>
  <output aria-label="Last completed">{complete}</output>
  <button onclick={() => controller.toggle()}>{fixture.controller}</button>
</div>
