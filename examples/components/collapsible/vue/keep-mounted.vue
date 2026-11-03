<script setup lang="ts">
import { ChevronDownIcon } from "@lucide/vue"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/vue/collapsible"
</script>

<template>
  <Collapsible>
    <CollapsibleTrigger data-variant="secondary">
      Add a delivery note
      <ChevronDownIcon />
    </CollapsibleTrigger>
    <CollapsiblePanel keep-mounted>
      <label data-slot="label">
        <span>Delivery note</span>
        <textarea placeholder="Leave it with the front desk…" />
      </label>
    </CollapsiblePanel>
  </Collapsible>
</template>
