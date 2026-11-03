<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@ui-sdk/vue/autocomplete"
import { ref } from "vue"

const recent = ["react hooks", "tailwind grid", "web components", "vue v-model"]

const searched = ref("")
</script>

<template>
  <form role="search" data-slot="stack" @submit.prevent>
    <Autocomplete submit-on-select name="q" @submit="(value: string) => (searched = value)">
      <AutocompleteInput type="search" aria-label="Search" placeholder="Search…" />
      <AutocompleteContent>
        <AutocompleteList>
          <AutocompleteItem v-for="search in recent" :key="search" :value="search">{{
            search
          }}</AutocompleteItem>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
    <output data-slot="output">{{ searched ? `Searched “${searched}”` : "Press Enter to search" }}</output>
  </form>
</template>
