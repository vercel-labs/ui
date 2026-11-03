<script setup lang="ts">
import { ChevronDownIcon } from "@lucide/vue"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/vue/collapsible"
</script>

<template>
  <div data-slot="stack">
    <Collapsible>
      <CollapsibleTrigger data-variant="secondary">
        Shipping details
        <ChevronDownIcon />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <p data-slot="hint">Standard shipping. Arrives in 3 to 5 business days.</p>
      </CollapsiblePanel>
    </Collapsible>
    <Collapsible disabled>
      <CollapsibleTrigger data-variant="secondary">
        <span>Gift options</span>
        <span data-slot="hint">Not available for this order</span>
        <ChevronDownIcon />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <p data-slot="hint">Add a gift message and wrapping.</p>
      </CollapsiblePanel>
    </Collapsible>
  </div>
</template>
