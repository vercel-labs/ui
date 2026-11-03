<script setup lang="ts">
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@lucide/vue"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/vue/toggle"

const formatting = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "underline", label: "Underline", icon: UnderlineIcon },
]
</script>

<template>
  <div data-slot="stack">
    <ToggleGroup multiple disabled :default-value="['bold']" aria-label="Text formatting, disabled">
      <Toggle v-for="item in formatting" :key="item.value" :value="item.value" :aria-label="item.label">
        <ToggleIcon>
          <component :is="item.icon" />
        </ToggleIcon>
      </Toggle>
    </ToggleGroup>
    <ToggleGroup multiple aria-label="Text formatting">
      <Toggle
        v-for="item in formatting"
        :key="item.value"
        :value="item.value"
        :disabled="item.value === 'underline'"
        :aria-label="item.label"
      >
        <ToggleIcon>
          <component :is="item.icon" />
        </ToggleIcon>
      </Toggle>
    </ToggleGroup>
  </div>
</template>
