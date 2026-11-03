<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/vue/listbox"
import { ref } from "vue"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
]

const value = ref<string | null>(null)
</script>

<template>
  <div data-slot="stack">
    <Listbox v-model:value="value" activation="manual" aria-label="Framework">
      <ListboxItem v-for="framework in frameworks" :key="framework.value" :value="framework.value">
        {{ framework.label }}
        <ListboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
      </ListboxItem>
    </Listbox>
    <output data-slot="output">Value: {{ value ?? "none" }}</output>
  </div>
</template>
