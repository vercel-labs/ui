<script setup lang="ts">
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue/menu"
import { ref } from "vue"

const container = ref<HTMLElement | null>(null)
</script>

<template>
  <div data-slot="row">
    <Menu>
      <MenuTrigger>Open</MenuTrigger>
      <MenuContent :container="container">
        <MenuItem>Rendered in the panel</MenuItem>
        <MenuItem>Still placed by the trigger</MenuItem>
      </MenuContent>
    </Menu>
    <div data-slot="card">
      Container
      <div ref="container" />
    </div>
  </div>
</template>
