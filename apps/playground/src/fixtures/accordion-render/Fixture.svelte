<script lang="ts">
  import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
  } from "@ui-sdk/svelte"
  import { describeValue } from "tests/fixtures/accordion.ts"

  let action = $state("")
</script>

<div class="fixture">
  <button>Before</button>
  <Accordion
    class="accordion"
    defaultValue={["overview"]}
    onValueChange={(value) => (action = describeValue(value))}
  >
    <AccordionItem class="accordion-item" value="overview">
      {#snippet children(state)}
        <span class={state.open ? "is-open" : "is-closed"} hidden></span>
        <AccordionHeader class="accordion-header">
          {#snippet render({ props })}
            <h2 {...props}>
              <AccordionTrigger class="accordion-trigger">
                {#snippet render({ props, state: trigger })}
                  <button {...props}>
                    Overview<span aria-hidden="true">
                      {trigger.open ? "−" : "+"}</span
                    >
                    <span class="index" hidden>{trigger.index}</span>
                  </button>
                {/snippet}
              </AccordionTrigger>
            </h2>
          {/snippet}
        </AccordionHeader>
        <AccordionPanel class="accordion-panel">
          {#snippet render({ props })}
            <section {...props}>The overview panel.</section>
          {/snippet}
        </AccordionPanel>
      {/snippet}
    </AccordionItem>
    <AccordionItem class="accordion-item" value="details">
      <AccordionHeader class="accordion-header">
        <AccordionTrigger class="accordion-trigger">
          {#snippet render({ props })}
            <div {...props}>Details</div>
          {/snippet}
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionPanel class="accordion-panel">The details panel.</AccordionPanel
      >
    </AccordionItem>
  </Accordion>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
