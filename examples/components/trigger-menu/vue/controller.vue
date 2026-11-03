<script setup lang="ts">
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  createTriggerMenuController,
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

const menu = createTriggerMenuController()
const result = ref("")

async function mention() {
  const closed = await menu.open({ trigger: "@" })
  result.value = `Closed with ${closed.reason}`
}

function insertDate() {
  const match = menu.getMatch()
  result.value = match ? `Query “${menu.getQuery()}” at ${match.start}` : `Open: ${menu.isOpen()}`
  menu.insert(new Date().toLocaleDateString())
}

function toggle() {
  if (menu.isOpen()) {
    menu.close()
  } else {
    menu.setOpen(true)
  }
}
</script>

<template>
  <TriggerMenu :controller="menu" :triggers="[{ char: '@', items: people }]">
    <div data-slot="stack">
      <TriggerMenuInput aria-label="Message" />
      <div data-slot="row">
        <button type="button" data-variant="secondary" @mousedown.prevent @click="mention">Mention</button>
        <button type="button" data-variant="secondary" @mousedown.prevent @click="insertDate">
          Insert date
        </button>
        <button type="button" data-variant="secondary" @mousedown.prevent @click="toggle">Toggle</button>
      </div>
      <p data-slot="hint">{{ result }}</p>
    </div>
    <TriggerMenuContent>
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
