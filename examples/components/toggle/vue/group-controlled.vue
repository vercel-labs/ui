<script setup lang="ts">
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@lucide/vue"
import { Toggle, ToggleGroup, ToggleIcon, createToggleGroupController } from "@ui-sdk/vue/toggle"
import { ref } from "vue"

const formatting = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "underline", label: "Underline", icon: UnderlineIcon },
]

const editor = createToggleGroupController()
const value = ref(["bold"])
const reason = ref("")
</script>

<template>
  <div data-slot="stack">
    <ToggleGroup
      v-model:value="value"
      multiple
      aria-label="Text formatting"
      :controller="editor"
      @value-change="(_: string[], details: { reason: string }) => (reason = details.reason)"
    >
      <Toggle v-for="item in formatting" :key="item.value" :value="item.value" :aria-label="item.label">
        <ToggleIcon>
          <component :is="item.icon" />
        </ToggleIcon>
      </Toggle>
    </ToggleGroup>
    <button type="button" @click="editor.setValue([])">Clear</button>
    <output data-slot="output">
      Pressed: {{ value.length ? value.join(", ") : "none" }}{{ reason && `, last change: ${reason}` }}
    </output>
  </div>
</template>
