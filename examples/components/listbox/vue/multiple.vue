<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/vue/listbox"
import { ref } from "vue"

const toppings = [
  { value: "basil", label: "Basil" },
  { value: "cheese", label: "Extra cheese" },
  { value: "mushroom", label: "Mushroom" },
  { value: "olive", label: "Olive" },
  { value: "onion", label: "Onion" },
  { value: "pepper", label: "Pepper" },
]

const value = ref<string[]>(["cheese", "onion"])
</script>

<template>
  <div data-slot="stack">
    <Listbox v-model:value="value" multiple aria-label="Toppings">
      <ListboxItem v-for="topping in toppings" :key="topping.value" :value="topping.value">
        <ListboxItemIndicator keep-mounted>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
        {{ topping.label }}
      </ListboxItem>
    </Listbox>
    <output data-slot="output">Value: {{ JSON.stringify(value) }}</output>
  </div>
</template>
