<script setup lang="ts">
import { Command, CommandInput, CommandItem, CommandList } from "@ui-sdk/vue/command"

const commands = ["Home", "Inbox", "Documents", "Downloads", "Pictures", "Music", "New file", "New folder"]
</script>

<template>
  <Command :auto-highlight="false" :loop="false">
    <CommandInput aria-label="Search commands" placeholder="Type, then press ArrowDown" />
    <CommandList>
      <CommandItem v-for="label in commands" :key="label" :value="label">
        {{ label }}
      </CommandItem>
    </CommandList>
  </Command>
</template>
