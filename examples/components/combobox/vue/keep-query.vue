<script setup lang="ts">
import { CheckIcon, XIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from "@ui-sdk/vue/combobox"

const labels = ["Bug", "Feature", "Documentation", "Design", "Performance", "Security", "Testing"]
</script>

<template>
  <Combobox multiple keep-query>
    <div data-slot="stack">
      <ComboboxLabel>Labels</ComboboxLabel>
      <ComboboxChips>
        <ComboboxValue v-slot="{ value }">
          <ComboboxChip v-for="label in value as string[]" :key="label" :value="label">
            {{ label }}
            <ComboboxChipRemove :aria-label="`Remove ${label}`">
              <XIcon aria-hidden="true" />
            </ComboboxChipRemove>
          </ComboboxChip>
        </ComboboxValue>
        <ComboboxInput placeholder="Add labels" />
      </ComboboxChips>
    </div>
    <ComboboxContent>
      <ComboboxList>
        <ComboboxItem v-for="label in labels" :key="label" :value="label">
          {{ label }}
          <ComboboxItemIndicator>
            <CheckIcon aria-hidden="true" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</template>
