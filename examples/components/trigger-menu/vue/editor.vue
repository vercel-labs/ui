<script setup lang="ts">
import {
  type TextEditorAdapter,
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
  textFieldAdapter,
} from "@ui-sdk/vue/trigger-menu"
import { onMounted, ref, shallowRef } from "vue"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

const field = ref<HTMLTextAreaElement | null>(null)
const editor = shallowRef<TextEditorAdapter>()
onMounted(() => {
  if (field.value) {
    editor.value = textFieldAdapter(field.value)
  }
})
</script>

<template>
  <TriggerMenu :editor="editor" :triggers="[{ char: '@', items: people }]">
    <textarea ref="field" aria-label="Notes" placeholder="A textarea you render yourself" />
    <TriggerMenuContent>
      <TriggerMenuList v-slot="{ state }">
        <TriggerMenuItem
          v-for="item in state.items as TriggerMenuDataItem[]"
          :key="item.value"
          :value="item.value"
          :label="item.label"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </TriggerMenuItem>
      </TriggerMenuList>
    </TriggerMenuContent>
  </TriggerMenu>
</template>
