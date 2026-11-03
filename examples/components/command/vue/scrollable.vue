<script setup lang="ts">
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/vue/command"

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
</script>

<template>
  <Command>
    <CommandInput aria-label="Search commands" placeholder="Search..." />
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandList>
      <CommandItem v-for="label in commands" :key="label" :value="label">
        {{ label }}
      </CommandItem>
    </CommandList>
  </Command>
</template>
