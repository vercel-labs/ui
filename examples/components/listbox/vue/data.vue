<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Listbox, ListboxItem, ListboxItemIndicator, type ListData } from "@ui-sdk/vue/listbox"
import { ref } from "vue"

const plans = [
  { value: { id: "hobby", price: 0 }, label: "Hobby" },
  { value: { id: "pro", price: 20 }, label: "Pro" },
  { value: { id: "team", price: 50 }, label: "Team" },
  { value: { id: "enterprise", price: 200 }, label: "Enterprise", disabled: true },
] satisfies ListData<{ id: string; price: number }>

const value = ref<{ id: string; price: number } | null>({ id: "pro", price: 20 })
</script>

<template>
  <div data-slot="stack">
    <Listbox
      v-model:value="value"
      :items="plans"
      :item-to-value="(plan: { id: string }) => plan.id"
      :is-item-equal-to-value="(plan: { id: string }, selected: { id: string }) => plan.id === selected.id"
      aria-label="Plan"
    >
      <ListboxItem v-for="plan in plans" :key="plan.value.id" :value="plan.value" :disabled="plan.disabled">
        {{ plan.label }}
        <ListboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
      </ListboxItem>
    </Listbox>
    <output data-slot="output">{{ value ? `${value.id}, $${value.price} a month` : "No plan" }}</output>
  </div>
</template>
