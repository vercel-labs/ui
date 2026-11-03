<script setup lang="ts">
import { CircleQuestionMarkIcon } from "@lucide/vue"
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { ref } from "vue"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const
const open = ref(false)
const pinned = ref(false)
const side = ref<(typeof sides)[number]>("top")
const align = ref<(typeof aligns)[number]>("center")

function onOpenChange(next: boolean, details: { cancel: () => void }) {
  open.value = next
  if (!next && pinned.value) details.cancel()
}
</script>

<template>
  <div data-slot="stack">
    <div data-slot="stack">
      <div data-slot="grid">
        <span data-slot="hint">side</span>
        <div data-slot="row" role="group" aria-label="side">
          <button
            v-for="value in sides"
            :key="value"
            type="button"
            data-size="sm"
            :aria-pressed="side === value"
            @click="side = value"
          >
            {{ value }}
          </button>
        </div>
        <span data-slot="hint">align</span>
        <div data-slot="row" role="group" aria-label="align">
          <button
            v-for="value in aligns"
            :key="value"
            type="button"
            data-size="sm"
            :aria-pressed="align === value"
            @click="align = value"
          >
            {{ value }}
          </button>
        </div>
      </div>
      <label data-slot="label">
        <input v-model="pinned" type="checkbox" />
        Keep open
      </label>
    </div>
    <Tooltip :open="pinned || open" @open-change="onOpenChange">
      <TooltipTrigger>
        <CircleQuestionMarkIcon />
      </TooltipTrigger>
      <TooltipContent :side="side" :align="align" :side-offset="8" :arrow-padding="8">
        <TooltipArrow />
        Keyboard shortcuts
      </TooltipContent>
    </Tooltip>
  </div>
</template>
