<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@ui-sdk/vue/autocomplete"
import { ref } from "vue"

const fruits = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry"]

const box = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div ref="box" data-slot="card">
    <Autocomplete modal="pointer" :container="box">
      <AutocompleteLabel>Fruit</AutocompleteLabel>
      <AutocompleteInput />
      <AutocompleteContent
        side="top"
        align="end"
        :side-offset="10"
        :align-offset="-4"
        :collision-padding="8"
        :anchor="box"
        keep-mounted
      >
        <AutocompleteArrow />
        <AutocompleteList>
          <AutocompleteItem v-for="fruit in fruits" :key="fruit" :value="fruit">{{ fruit }}</AutocompleteItem>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  </div>
</template>
