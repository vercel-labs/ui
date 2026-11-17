<script setup lang="ts">
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue"
import { ref } from "vue"

const open = ref(false)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Menu :open="open" @open-change="(next: boolean) => (open = next)">
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent v-if="open" class="popup fill-in">
        <MenuItem class="item" value="rename">Rename</MenuItem>
        <MenuItem class="item" value="delete">Delete</MenuItem>
      </MenuContent>
    </Menu>
  </div>
</template>
