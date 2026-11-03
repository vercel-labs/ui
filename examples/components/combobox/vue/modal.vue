<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
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

const modes = [
  { value: false, label: "Non-modal" },
  { value: "pointer", label: "Pointer" },
  { value: true, label: "Modal" },
] as const

const modal = ref<boolean | "pointer">(false)
const presses = ref(0)
</script>

<template>
  <div data-slot="stack">
    <div role="group" aria-label="Modal" data-slot="row">
      <button
        v-for="mode in modes"
        :key="mode.label"
        type="button"
        :aria-pressed="modal === mode.value"
        @click="modal = mode.value"
      >
        {{ mode.label }}
      </button>
    </div>
    <Combobox :modal="modal">
      <div data-slot="stack">
        <ComboboxLabel>Framework</ComboboxLabel>
        <div data-slot="row">
          <ComboboxInput placeholder="Select a framework" />
          <ComboboxTrigger aria-label="Show frameworks">
            <ChevronDownIcon />
          </ComboboxTrigger>
        </div>
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
    <button type="button" @click="presses++">Pressed {{ presses }} times</button>
  </div>
</template>
