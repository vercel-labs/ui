<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  createSelectController,
} from "@ui-sdk/vue/select"
import { ref } from "vue"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const fruit = createSelectController<string>()
const log = ref("")

async function openFruit() {
  const { reason } = await fruit.open()
  log.value = `Closed by ${reason}, with ${fruit.getValue() ?? "nothing"}`
}
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <span data-slot="hint">Toolbar</span>
      <SelectTrigger :controller="fruit" aria-label="Fruit" />
    </div>
    <Select :controller="fruit" :items="fruits" placeholder="Fruit">
      <SelectContent>
        <SelectItem v-for="item in fruits" :key="item.value" :value="item.value">
          {{ item.label }}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      </SelectContent>
    </Select>
    <div data-slot="row">
      <button type="button" @click="openFruit">Open</button>
      <button type="button" @click="fruit.setValue('banana')">Banana</button>
      <button type="button" @click="fruit.clear()">Clear</button>
      <button type="button" @click="fruit.focus()">Focus</button>
    </div>
    <output data-slot="output">{{ log || "Use the buttons" }}</output>
  </div>
</template>
