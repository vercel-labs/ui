<script setup lang="ts">
import { BoldIcon, CodeIcon, ItalicIcon, LinkIcon, UnderlineIcon } from "@lucide/vue"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/vue/tooltip"
import { ref } from "vue"

const tools = [
  { icon: BoldIcon, label: "Bold" },
  { icon: ItalicIcon, label: "Italic" },
  { icon: UnderlineIcon, label: "Underline" },
  { icon: LinkIcon, label: "Link" },
  { icon: CodeIcon, label: "Code" },
]

const delays = [0, 600, 1200]
const closeDelays = [0, 300]
const delay = ref(600)
const closeDelay = ref(0)
const enabled = ref(true)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="grid">
      <span data-slot="hint">delay</span>
      <div data-slot="row" role="group" aria-label="delay">
        <button
          v-for="value in delays"
          :key="value"
          type="button"
          data-size="sm"
          :aria-pressed="delay === value"
          @click="delay = value"
        >
          {{ value }}
        </button>
      </div>
      <span data-slot="hint">closeDelay</span>
      <div data-slot="row" role="group" aria-label="closeDelay">
        <button
          v-for="value in closeDelays"
          :key="value"
          type="button"
          data-size="sm"
          :aria-pressed="closeDelay === value"
          @click="closeDelay = value"
        >
          {{ value }}
        </button>
      </div>
    </div>
    <label data-slot="label">
      <input v-model="enabled" type="checkbox" />
      Show tooltips
    </label>
    <div data-slot="row" role="group" aria-label="Formatting">
      <Tooltip
        v-for="tool in tools"
        :key="tool.label"
        :delay="delay"
        :close-delay="closeDelay"
        :disabled="!enabled"
      >
        <TooltipTrigger>
          <component :is="tool.icon" />
        </TooltipTrigger>
        <TooltipContent>{{ tool.label }}</TooltipContent>
      </Tooltip>
    </div>
  </div>
</template>
