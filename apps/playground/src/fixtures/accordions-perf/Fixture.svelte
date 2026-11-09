<script lang="ts">
  import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
  } from "@ui-sdk/svelte"
  import { perfSize } from "tests/fixtures/perf.ts"

  // An accordion of N items, like a long FAQ.
  // Every item starts closed. With ?found, closed panels stay in the page for
  // find in page.
  const items = Array.from({ length: perfSize(200) }, (_, index) => index)
  const found = new URLSearchParams(location.search).has("found")
</script>

<div class="fixture" style="flex-direction: column; align-items: start">
  <button>Before</button>
  <Accordion class="accordion" hiddenUntilFound={found}>
    {#each items as index (index)}
      <AccordionItem class="accordion-item" value={`item-${index}`}>
        <AccordionHeader class="accordion-header">
          <AccordionTrigger class="accordion-trigger"
            >Question {index + 1}</AccordionTrigger
          >
        </AccordionHeader>
        <AccordionPanel class="accordion-panel"
          >Answer {index + 1}</AccordionPanel
        >
      </AccordionItem>
    {/each}
  </Accordion>
  <button>After</button>
</div>
