<script setup lang="ts">
import { FileIcon } from "@lucide/vue"
import { Listbox, ListboxItem, ListboxItemIcon } from "@ui-sdk/vue/listbox"
import { ref } from "vue"

const files = [
  { value: "readme", label: "README.md" },
  { value: "package", label: "package.json" },
  { value: "tsconfig", label: "tsconfig.json" },
  { value: "index", label: "index.ts" },
  { value: "styles", label: "styles.css" },
  { value: "logo", label: "logo.svg" },
]

const value = ref<string[]>(["readme"])
</script>

<template>
  <div data-slot="stack">
    <Listbox v-model:value="value" multiple activation="automatic" aria-label="Files">
      <ListboxItem v-for="file in files" :key="file.value" :value="file.value">
        <ListboxItemIcon>
          <FileIcon aria-hidden="true" />
        </ListboxItemIcon>
        {{ file.label }}
      </ListboxItem>
    </Listbox>
    <output data-slot="output">{{ value.length }} selected</output>
  </div>
</template>
