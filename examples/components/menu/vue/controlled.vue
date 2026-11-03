<script setup lang="ts">
import { createMenuController, Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue/menu"
import { ref } from "vue"

const menu = createMenuController()

const open = ref(false)
const reason = ref("")
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <Menu
        v-model:open="open"
        :controller="menu"
        @open-change="(_: boolean, details: { reason: string }) => (reason = details.reason)"
      >
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem value="rename">Rename</MenuItem>
          <MenuItem value="duplicate">Duplicate</MenuItem>
          <MenuItem value="archive">Archive</MenuItem>
        </MenuContent>
      </Menu>
      <button data-variant="ghost" @click="open = true">Open with state</button>
      <button data-variant="ghost" @click="menu.open({ focus: 'first' })">Open with the controller</button>
    </div>

    <output data-slot="output"
      >{{ open ? "Open" : "Closed" }}{{ reason && `, last change: ${reason}` }}</output
    >
  </div>
</template>
