<script setup lang="ts">
import { ChevronDownIcon } from "@lucide/vue"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/vue/collapsible"
</script>

<template>
  <div data-slot="stack">
    <Collapsible>
      <CollapsibleTrigger data-variant="secondary">
        Ingredients
        <ChevronDownIcon />
      </CollapsibleTrigger>
      <CollapsiblePanel hidden-until-found>
        <p data-slot="hint">Flour, butter, brown sugar, eggs, a pinch of cardamom and sea salt.</p>
      </CollapsiblePanel>
    </Collapsible>
  </div>
</template>
