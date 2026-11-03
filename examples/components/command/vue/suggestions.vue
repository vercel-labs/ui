<script setup lang="ts">
import { SearchIcon } from "@lucide/vue"
import type { ListAnnouncement } from "@ui-sdk/core/command"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  type CommandData,
} from "@ui-sdk/vue/command"

const commands: CommandData = [
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

const suggested: CommandData = [
  { type: "group", label: "Suggested", items: ["New file", "Settings", "Help"] },
]

const announcement = (change: ListAnnouncement) =>
  change.type === "results" ? `${change.count} commands` : null
</script>

<template>
  <Command :items="commands" :empty-items="suggested" :announcement="announcement">
    <div data-slot="row">
      <SearchIcon aria-hidden="true" />
      <CommandInput aria-label="Search commands" placeholder="Search commands…" />
    </div>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandList v-slot="{ state }">
      <template
        v-for="entry in state.items as (string | { label: string; items: string[] })[]"
        :key="typeof entry === 'string' ? entry : entry.label"
      >
        <CommandItem v-if="typeof entry === 'string'" :value="entry">
          <CommandItemText />
        </CommandItem>
        <CommandGroup v-else>
          <CommandGroupLabel>{{ entry.label }}</CommandGroupLabel>
          <CommandItem v-for="command in entry.items" :key="command" :value="command">
            <CommandItemText />
          </CommandItem>
        </CommandGroup>
      </template>
    </CommandList>
  </Command>
</template>
