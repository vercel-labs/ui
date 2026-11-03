<script setup lang="ts">
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue/menu"
import { ref } from "vue"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

const side = ref<(typeof sides)[number]>("bottom")
const align = ref<(typeof aligns)[number]>("start")
</script>

<template>
  <div data-slot="stack">
    <div data-slot="stack">
      <div data-slot="row" role="group" aria-label="Side">
        <button
          v-for="value in sides"
          :key="value"
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
          data-size="sm"
          :aria-pressed="align === value"
          @click="align = value"
        >
          {{ value }}
        </button>
      </div>
    </div>
    <Menu>
      <MenuTrigger>Placement</MenuTrigger>
      <MenuContent :side="side" :align="align">
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </MenuContent>
    </Menu>
  </div>
</template>
