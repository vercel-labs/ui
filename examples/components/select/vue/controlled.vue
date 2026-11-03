<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
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

const value = ref<string | null>("apple")
const open = ref(false)
const log = ref("")

function onValueChange(next: unknown, details: { reason: string; cancel: () => void }) {
  if (next === "pineapple") {
    details.cancel()
    log.value = "Pineapple is sold out"
    return
  }
  log.value = `value: ${next} (${details.reason})`
}

function onOpenChange(next: boolean, details: { reason: string }) {
  log.value = `open: ${next} (${details.reason})`
}
</script>

<template>
  <div data-slot="stack">
    <Select
      v-model:value="value"
      v-model:open="open"
      debug
      @value-change="onValueChange"
      @open-change="onOpenChange"
    >
      <div data-slot="stack">
        <SelectLabel>Fruit</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectItem v-for="fruit in fruits" :key="fruit.value" :value="fruit.value">
          {{ fruit.label }}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      </SelectContent>
    </Select>
    <div data-slot="row">
      <button type="button" @click="value = 'blueberry'">Blueberry</button>
      <button type="button" @click="open = true">Open</button>
    </div>
    <output data-slot="output">{{ log || "Change something" }}</output>
  </div>
</template>
