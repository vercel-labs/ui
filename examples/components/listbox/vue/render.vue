<script setup lang="ts">
import { ExternalLinkIcon } from "@lucide/vue"
import { Listbox, ListboxItem } from "@ui-sdk/vue/listbox"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
]
</script>

<template>
  <Listbox default-value="next" activation="manual" aria-label="Framework docs">
    <ListboxItem
      v-for="framework in frameworks"
      :key="framework.value"
      :href="`#${framework.value}`"
      :value="framework.value"
      :label="framework.label"
    >
      <template #render="{ props, state }">
        <a v-bind="props">
          <span>{{ framework.label }}</span>
          <ExternalLinkIcon aria-hidden="true" v-if="state.selected" />
        </a>
      </template>
    </ListboxItem>
  </Listbox>
</template>
