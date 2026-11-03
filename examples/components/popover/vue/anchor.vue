<script setup lang="ts">
import { SettingsIcon } from "@lucide/vue"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { ref } from "vue"

const anchor = ref<HTMLInputElement | null>(null)
</script>

<template>
  <div data-slot="row">
    <input ref="anchor" placeholder="Search" aria-label="Search" />
    <Popover>
      <PopoverTrigger aria-label="Search filters">
        <SettingsIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent :anchor="anchor" align="start" :side-offset="8">
        <PopoverTitle>Filters</PopoverTitle>
        <PopoverDescription>The popover lines up with the search field.</PopoverDescription>
      </PopoverContent>
    </Popover>
  </div>
</template>
