<script setup lang="ts">
import { ArrowLeftIcon } from "@lucide/vue"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@ui-sdk/vue/autocomplete"

const fruits = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry"]
</script>

<template>
  <Autocomplete required>
    <div data-slot="stack">
      <AutocompleteLabel>Fruit</AutocompleteLabel>
      <AutocompleteInput>
        <template #render="{ props }">
          <input v-bind="props" />
        </template>
      </AutocompleteInput>
    </div>
    <AutocompleteContent>
      <AutocompleteList>
        <AutocompleteItem value="Fruit guide" href="#fruit-guide">
          <template #render="{ props }">
            <a v-bind="props">Read the fruit guide</a>
          </template>
        </AutocompleteItem>
        <AutocompleteItem v-for="fruit in fruits" :key="fruit" :value="fruit" :label="fruit">
          <template #render="{ props, state }">
            <div v-bind="props">{{ fruit }}<ArrowLeftIcon v-if="state.highlighted" aria-hidden="true" /></div>
          </template>
        </AutocompleteItem>
      </AutocompleteList>
    </AutocompleteContent>
  </Autocomplete>
</template>
