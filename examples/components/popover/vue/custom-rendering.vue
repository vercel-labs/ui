<script setup lang="ts">
import { BellIcon } from "@lucide/vue"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverShortcut,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
</script>

<template>
  <Popover>
    <PopoverTrigger shortcut="mod+u">
      <template #render="{ props, state }">
        <button v-bind="props">
          <BellIcon />
          {{ state.open ? "Hide updates" : "Show updates" }}
          <PopoverShortcut v-slot="{ state: shortcut }">{{ shortcut.text }}</PopoverShortcut>
        </button>
      </template>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverTitle>
        <template #render="{ props }">
          <h3 v-bind="props">Updates</h3>
        </template>
      </PopoverTitle>
      <PopoverDescription>Version 2.0 is out.</PopoverDescription>
      <PopoverClose href="https://example.com/changelog">
        <template #render="{ props }">
          <a v-bind="props">Read the changelog</a>
        </template>
      </PopoverClose>
    </PopoverContent>
  </Popover>
</template>
