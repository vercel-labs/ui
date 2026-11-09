<script lang="ts">
  import { createAccordionController } from "@ui-sdk/core/accordion"
  import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
  } from "@ui-sdk/svelte"
  import { accordionFixture, describeValue } from "tests/fixtures/accordion.ts"
  import { accordionOptions } from "tests/fixtures/page.ts"

  const controller = createAccordionController()
  const { cancel, ...options } = accordionOptions()

  let action = $state("")
  let complete = $state("")
  let warrantyEnabled = $state(false)

  function onValueChange(value: string[], details: { cancel: () => void }) {
    if (
      cancel &&
      value.includes(cancel) &&
      !controller.getValue().includes(cancel)
    ) {
      return details.cancel()
    }
    action = describeValue(value)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Accordion class="accordion" {...options} {controller} {onValueChange}>
    {#each accordionFixture.items as item (item.value)}
      <AccordionItem
        class="accordion-item"
        value={item.value}
        disabled={item.disabled && !warrantyEnabled}
        onOpenChangeComplete={(open) =>
          (complete = `${item.value} ${open ? "open" : "closed"}`)}
      >
        <AccordionHeader class="accordion-header">
          <AccordionTrigger class="accordion-trigger"
            >{item.label}</AccordionTrigger
          >
        </AccordionHeader>
        <AccordionPanel class="accordion-panel">
          {item.content}
          {#if item.field}
            <label> {item.field} <input /></label>
          {/if}
          {#if item.close}
            <button onclick={() => controller.close(item.value)}
              >{item.close}</button
            >
          {/if}
        </AccordionPanel>
      </AccordionItem>
    {/each}
  </Accordion>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Last completed">{complete}</output>
  <button onclick={() => controller.open("support")}>Show support</button>
  <button onclick={() => (warrantyEnabled = !warrantyEnabled)}
    >Toggle warranty</button
  >
</div>
