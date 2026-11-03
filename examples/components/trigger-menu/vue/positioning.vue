<script setup lang="ts">
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/vue/trigger-menu"
import { ref } from "vue"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

const field = ref<{ $el: HTMLTextAreaElement } | null>(null)
const box = ref<HTMLDivElement | null>(null)
</script>

<template>
  <TriggerMenu :triggers="[{ char: '@', items: people }]">
    <div data-slot="stack">
      <TriggerMenuInput
        ref="field"
        aria-label="Comment"
        placeholder="The list opens above, at the field's start"
      />
      <div ref="box" />
    </div>
    <TriggerMenuContent
      side="top"
      align="start"
      :side-offset="8"
      :align-offset="-4"
      :collision-padding="16"
      :anchor="field?.$el ?? null"
      keep-mounted
      :container="box"
    >
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
