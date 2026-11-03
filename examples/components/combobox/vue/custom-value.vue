<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
} from "@ui-sdk/vue/combobox"
import { ref } from "vue"

const titles = ["Designer", "Engineer", "Engineering manager", "Product manager", "Researcher"]

const value = ref<string | null>(null)
</script>

<template>
  <div data-slot="stack">
    <Combobox v-model:value="value" allow-custom-value>
      <div data-slot="stack">
        <ComboboxLabel>Job title</ComboboxLabel>
        <ComboboxInput placeholder="Type any title" />
      </div>
      <ComboboxContent>
        <ComboboxEmpty v-slot="{ state }">
          <template v-if="state.empty">Press Enter to use “{{ state.query }}”.</template>
        </ComboboxEmpty>
        <ComboboxList>
          <ComboboxItem v-for="title in titles" :key="title" :value="title">
            {{ title }}
            <ComboboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <output data-slot="output">Value: {{ JSON.stringify(value) }}</output>
  </div>
</template>
