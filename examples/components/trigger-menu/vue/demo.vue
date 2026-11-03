<script setup lang="ts">
import { useId } from "vue"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  TriggerMenuStatus,
} from "@ui-sdk/vue/trigger-menu"

const id = useId()

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]
</script>

<template>
  <TriggerMenu :triggers="[{ char: '@', items: people }]">
    <div data-slot="stack">
      <label :for="id" data-slot="label">Message</label>
      <TriggerMenuInput :id="id" placeholder="Type @ to mention someone" />
      <div data-slot="visually-hidden">
        <TriggerMenuStatus />
      </div>
    </div>
    <TriggerMenuContent>
      <TriggerMenuEmpty>No one found.</TriggerMenuEmpty>
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
