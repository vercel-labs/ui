<script setup lang="ts">
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/vue/command"
import { ref } from "vue"

const commands = [
  "Home",
  "Inbox",
  "Documents",
  "Downloads",
  "Pictures",
  "Music",
  "New file",
  "New folder",
  "Copy",
  "Cut",
  "Paste",
  "Delete",
  "Zoom in",
  "Zoom out",
  "Notifications",
  "Help",
  "Keyboard shortcuts",
  "Settings",
]

const filters = ["fuzzy", "contains", "startsWith", "words"] as const

function words(item: { label: string }, query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) =>
      item.label
        .toLowerCase()
        .split(" ")
        .some((part) => part.startsWith(word)),
    )
}

const mode = ref<(typeof filters)[number]>("fuzzy")
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <button
        v-for="name in filters"
        :key="name"
        type="button"
        :aria-pressed="mode === name"
        @click="mode = name"
      >
        {{ name }}
      </button>
    </div>
    <Command :filter="mode === 'words' ? words : mode">
      <CommandInput aria-label="Search commands" placeholder="Try “nf” or “zo in”" />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        <CommandItem v-for="label in commands" :key="label" :value="label">
          {{ label }}
        </CommandItem>
      </CommandList>
    </Command>
  </div>
</template>
