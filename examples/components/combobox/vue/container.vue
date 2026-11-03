<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/vue/combobox"
import { ref } from "vue"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "solidstart", label: "SolidStart" },
  { value: "qwik", label: "Qwik City" },
]

const container = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div data-slot="stack">
    <Combobox :container="container">
      <div data-slot="row">
        <ComboboxInput aria-label="Framework" placeholder="Select a framework" />
        <ComboboxTrigger aria-label="Show frameworks">
          <ChevronDownIcon />
        </ComboboxTrigger>
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxItem
            v-for="framework in frameworks"
            :key="framework.value"
            :value="framework.value"
            :label="framework.label"
          >
            {{ framework.label }}
            <ComboboxItemIndicator>
              <CheckIcon />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    <div data-slot="card">
      Container
      <div ref="container" />
    </div>
  </div>
</template>
