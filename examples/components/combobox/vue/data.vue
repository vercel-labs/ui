<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@ui-sdk/vue/combobox"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", keywords: ["red"] },
]

const citrus = [
  { value: "lemon", label: "Lemon" },
  { value: "lime", label: "Lime" },
  { value: "orange", label: "Orange", disabled: true },
]
</script>

<template>
  <Combobox>
    <div data-slot="stack">
      <ComboboxLabel>Fruit</ComboboxLabel>
      <div data-slot="row">
        <ComboboxInput placeholder="Search fruits" />
        <ComboboxTrigger aria-label="Show fruits">
          <ChevronDownIcon aria-hidden="true" />
        </ComboboxTrigger>
      </div>
    </div>
    <ComboboxContent>
      <ComboboxList>
        <ComboboxItem
          v-for="fruit in fruits"
          :key="fruit.value"
          :value="fruit.value"
          :label="fruit.label"
          :keywords="fruit.keywords"
        >
          {{ fruit.label }}
          <ComboboxItemIndicator>
            <CheckIcon aria-hidden="true" />
          </ComboboxItemIndicator>
        </ComboboxItem>
        <ComboboxSeparator />
        <ComboboxGroup>
          <ComboboxGroupLabel>Citrus</ComboboxGroupLabel>
          <ComboboxItem
            v-for="fruit in citrus"
            :key="fruit.value"
            :value="fruit.value"
            :label="fruit.label"
            :disabled="fruit.disabled"
          >
            {{ fruit.label }}
            <ComboboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</template>
