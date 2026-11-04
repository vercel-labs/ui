<script setup lang="ts">
import { ChevronDownIcon } from "@lucide/vue"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/vue/collapsible"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/vue/field"
</script>

<template>
  <Collapsible data-variant="card">
    <CollapsibleTrigger>
      <span data-slot="stack">
        <span>Add a delivery note</span>
        <span data-slot="hint">Optional, for the courier</span>
      </span>
      <ChevronDownIcon />
    </CollapsibleTrigger>
    <CollapsiblePanel keep-mounted>
      <Field>
        <FieldLabel>Delivery note</FieldLabel>
        <FieldControl placeholder="Leave it with the front desk…">
          <template #render="{ props }">
            <textarea v-bind="props" />
          </template>
        </FieldControl>
      </Field>
    </CollapsiblePanel>
  </Collapsible>
</template>
