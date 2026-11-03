<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
  } from "@ui-sdk/svelte/accordion"

  const items = [
    {
      value: "one",
      label: "Why animate the height?",
      content: "So the content below slides instead of jumping.",
    },
    {
      value: "two",
      label: "Where does the height come from?",
      content: "The panel measures itself and writes the result to a CSS variable while it animates.",
    },
    {
      value: "three",
      label: "Does it animate on first paint?",
      content: "No. Panels open on the server or on mount show at once.",
    },
  ]

  let status = $state("")
</script>

<div>
  <Accordion defaultValue={["one"]}>
    {#each items as item (item.value)}
      <AccordionItem
        value={item.value}
        onOpenChangeComplete={(open) =>
          (status = `${open ? "Finished opening" : "Finished closing"} “${item.label}”`)}
      >
        <AccordionHeader>
          <AccordionTrigger>
            {item.label}
            <ChevronDownIcon aria-hidden="true" />
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          {item.content}
        </AccordionPanel>
      </AccordionItem>
    {/each}
  </Accordion>
  <output data-slot="output">{status || "Open or close an item."}</output>
</div>
