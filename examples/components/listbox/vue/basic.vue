<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/vue/listbox"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
]
</script>

<template>
  <Field>
    <FieldLabel>Framework</FieldLabel>
    <Listbox default-value="next">
      <ListboxItem v-for="framework in frameworks" :key="framework.value" :value="framework.value">
        {{ framework.label }}
        <ListboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
      </ListboxItem>
    </Listbox>
  </Field>
</template>
