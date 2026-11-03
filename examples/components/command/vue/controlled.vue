<script setup lang="ts">
import { Command, CommandInput, CommandItem, CommandList, CommandPage } from "@ui-sdk/vue/command"
import { ref } from "vue"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

const value = ref<string | null>("dark")
const query = ref("")
const pages = ref(["theme"])
const reason = ref("")
</script>

<template>
  <div data-slot="stack">
    <Command
      v-model:value="value"
      v-model:query="query"
      v-model:pages="pages"
      @value-change="(_next: string | null, details: { reason: string }) => (reason = details.reason)"
    >
      <CommandInput aria-label="Search themes" placeholder="Search themes..." />
      <CommandList>
        <CommandPage>
          <CommandItem value="theme" page="theme">Change theme…</CommandItem>
        </CommandPage>
        <CommandPage value="theme">
          <CommandItem v-for="theme in themes" :key="theme.value" :value="theme.value">
            {{ theme.label }}
          </CommandItem>
        </CommandPage>
      </CommandList>
    </Command>
    <output data-slot="output">
      Highlighted {{ value ?? "nothing" }} ({{ reason || "start" }}), text “{{ query }}”, pages [{{
        pages.join(", ")
      }}]
    </output>
    <Command default-value="system" default-query="s" :default-pages="[]" debug>
      <CommandInput aria-label="Search themes, uncontrolled" />
      <CommandList>
        <CommandItem v-for="theme in themes" :key="theme.value" :value="theme.value">
          {{ theme.label }}
        </CommandItem>
      </CommandList>
    </Command>
  </div>
</template>
