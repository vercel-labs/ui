<script setup lang="ts">
import { BoldIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "@lucide/vue"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/vue/toggle"

const formatting = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "underline", label: "Underline", icon: UnderlineIcon },
  { value: "strikethrough", label: "Strikethrough", icon: StrikethroughIcon },
]
</script>

<template>
  <ToggleGroup multiple :loop="false" aria-label="Text formatting">
    <Toggle v-for="item in formatting" :key="item.value" :value="item.value" :aria-label="item.label">
      <ToggleIcon>
        <component :is="item.icon" />
      </ToggleIcon>
    </Toggle>
  </ToggleGroup>
</template>
