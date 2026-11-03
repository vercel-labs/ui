<script setup lang="ts">
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/vue/command"

const commands = [
  { value: "calendar", label: "Calendar" },
  { value: "emoji", label: "Search Emoji", keywords: ["smiley", "face"] },
  { value: "calculator", label: "Calculator" },
]
</script>

<template>
  <Command>
    <CommandInput aria-label="Search commands" placeholder="Try “smiley”" />
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandList>
      <CommandItem
        v-for="item in commands"
        :key="item.value"
        :value="item.value"
        :label="item.label"
        :keywords="item.keywords"
      >
        <strong>{{ item.label }}</strong>
      </CommandItem>
    </CommandList>
  </Command>
</template>
