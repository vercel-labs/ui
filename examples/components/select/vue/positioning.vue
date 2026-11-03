<script setup lang="ts">
import {
  Select,
  SelectArrow,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue/select"
import { ref } from "vue"
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

const side = ref<(typeof sides)[number]>("bottom")
const align = ref<(typeof aligns)[number]>("start")
const box = ref<HTMLDivElement | null>(null)
const anchored = ref(false)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="stack">
      <div role="group" aria-label="Side" data-slot="row">
        <button
          v-for="value in sides"
          :key="value"
          type="button"
          :aria-pressed="side === value"
          @click="side = value"
        >
          {{ value }}
        </button>
      </div>
      <div role="group" aria-label="Align" data-slot="row">
        <button
          v-for="value in aligns"
          :key="value"
          type="button"
          :aria-pressed="align === value"
          @click="align = value"
        >
          {{ value }}
        </button>
      </div>
      <label data-slot="label">
        <input v-model="anchored" type="checkbox" />
        Anchor to the box
      </label>
    </div>
    <div ref="box" data-slot="card">
      <Select default-value="apple">
        <SelectTrigger aria-label="Fruit">
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
        <SelectContent
          :side="side"
          :align="align"
          :side-offset="10"
          :align-offset="0"
          :collision-padding="16"
          :anchor="anchored ? box : null"
        >
          <SelectArrow />
          <SelectItem v-for="fruit in fruits" :key="fruit.value" :value="fruit.value">
            {{ fruit.label }}
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
