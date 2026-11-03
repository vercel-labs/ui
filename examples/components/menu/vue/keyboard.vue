<script setup lang="ts">
import { Menu, MenuContent, MenuRadioGroup, MenuRadioItem, MenuTrigger } from "@ui-sdk/vue/menu"
import { computed, ref } from "vue"

const statuses = [
  { value: "online", label: "Online", hint: "Visible to everyone" },
  { value: "away", label: "Away", hint: "Shown as idle" },
  { value: "busy", label: "Do not disturb", hint: "Notifications are muted" },
  { value: "invisible", label: "Invisible", hint: "Appear offline" },
]

const status = ref("online")
const current = computed(() => statuses.find((option) => option.value === status.value)!)
</script>

<template>
  <div data-slot="stack">
    <Menu :loop="false">
      <MenuTrigger>
        {{ current.label }}
      </MenuTrigger>
      <MenuContent>
        <MenuRadioGroup v-model:value="status">
          <MenuRadioItem
            v-for="option in statuses"
            :key="option.value"
            :value="option.value"
            :label="option.label"
            close-on-select
          >
            <span data-slot="stack">
              {{ option.label }}
              <span data-slot="hint">{{ option.hint }}</span>
            </span>
          </MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
    <output data-slot="output">Arrow keys stop at the ends. Type a status to jump to it.</output>
  </div>
</template>
