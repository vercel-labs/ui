<script setup lang="ts">
import { BoldIcon, SearchIcon } from "@lucide/vue"
import { NumberInput, NumberInputControl } from "@ui-sdk/vue/number-input"
import { Toolbar, ToolbarButton, ToolbarInput } from "@ui-sdk/vue/toolbar"
</script>

<template>
  <Toolbar aria-label="Text">
    <ToolbarButton data-variant="secondary" aria-label="Bold">
      <BoldIcon />
    </ToolbarButton>
    <NumberInput :default-value="14" :min="8" :max="72">
      <ToolbarInput aria-label="Font size">
        <template #render="{ props }">
          <NumberInputControl v-bind="props" />
        </template>
      </ToolbarInput>
    </NumberInput>
    <ToolbarInput aria-label="Find" placeholder="Find…" />
    <ToolbarButton data-variant="secondary" aria-label="Search">
      <SearchIcon />
    </ToolbarButton>
  </Toolbar>
</template>
