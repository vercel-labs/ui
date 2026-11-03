<script setup lang="ts">
import { CircleQuestionMarkIcon } from "@lucide/vue"
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { ref } from "vue"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const
const open = ref(false)
const side = ref<(typeof sides)[number]>("bottom")
const align = ref<(typeof aligns)[number]>("start")
const controls = ref<HTMLElement | null>(null)

function onOpenChange(next: boolean, details: { event?: Event; cancel: () => void }) {
  const target = details.event?.target
  if (!next && target instanceof Node && controls.value?.contains(target)) return details.cancel()
  open.value = next
}
</script>

<template>
  <div data-slot="stack">
    <div ref="controls" data-slot="stack">
      <div data-slot="row" role="group" aria-label="Side">
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
      <div data-slot="row" role="group" aria-label="Align">
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
    <Popover :open="open" @open-change="onOpenChange">
      <PopoverTrigger aria-label="Help">
        <CircleQuestionMarkIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent :side="side" :align="align" :side-offset="10" :arrow-padding="12">
        <PopoverArrow />
        <PopoverTitle>Keyboard shortcuts</PopoverTitle>
        <PopoverDescription>Press ? anywhere to see every shortcut.</PopoverDescription>
      </PopoverContent>
    </Popover>
  </div>
</template>
