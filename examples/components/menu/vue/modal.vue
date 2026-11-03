<script setup lang="ts">
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue/menu"
import { ref } from "vue"

const clicks = ref(0)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <Menu modal="pointer">
        <MenuTrigger>Default</MenuTrigger>
        <MenuContent>
          <MenuItem>Rename</MenuItem>
          <MenuItem>Duplicate</MenuItem>
        </MenuContent>
      </Menu>
      <Menu modal>
        <MenuTrigger>Modal</MenuTrigger>
        <MenuContent>
          <MenuItem>Rename</MenuItem>
          <MenuItem>Duplicate</MenuItem>
        </MenuContent>
      </Menu>
      <Menu :modal="false">
        <MenuTrigger>Non-modal</MenuTrigger>
        <MenuContent>
          <MenuItem>Rename</MenuItem>
          <MenuItem>Duplicate</MenuItem>
        </MenuContent>
      </Menu>
    </div>
    <button @click="clicks++">
      Clicked {{ clicks }} {{ clicks === 1 ? "time" : "times" }}. Open a menu, then click here.
    </button>
  </div>
</template>
