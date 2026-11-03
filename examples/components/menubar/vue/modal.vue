<script setup lang="ts">
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue/menu"
import { Menubar } from "@ui-sdk/vue/menubar"
</script>

<template>
  <Menubar modal>
    <Menu v-for="label in ['File', 'Edit', 'View']" :key="label">
      <MenuTrigger>{{ label }}</MenuTrigger>
      <MenuContent>
        <MenuItem>{{ label }} settings</MenuItem>
      </MenuContent>
    </Menu>
  </Menubar>
</template>
