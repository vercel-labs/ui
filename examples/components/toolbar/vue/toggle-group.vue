<script setup lang="ts">
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon } from "@lucide/vue"
import { Toggle, ToggleGroup } from "@ui-sdk/vue/toggle"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/vue/toolbar"
import { ref } from "vue"

const formats = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "strikethrough", label: "Strikethrough", icon: StrikethroughIcon },
]

const style = ref<string[]>(["bold"])
</script>

<template>
  <div data-slot="stack">
    <Toolbar aria-label="Text">
      <ToggleGroup v-model:value="style" multiple aria-label="Text style">
        <Toggle
          data-variant="ghost"
          v-for="format in formats"
          :key="format.value"
          :value="format.value"
          :aria-label="format.label"
        >
          <component :is="format.icon" />
        </Toggle>
      </ToggleGroup>
      <ToolbarSeparator />
      <Toggle data-variant="ghost" aria-label="Code">
        <CodeIcon />
      </Toggle>
      <ToolbarButton data-variant="secondary" @click="style = []">Clear</ToolbarButton>
    </Toolbar>
    <output data-slot="output">Style: {{ style.join(", ") || "none" }}</output>
  </div>
</template>
