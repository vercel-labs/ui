<script setup lang="ts">
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue/menu"
import { Menubar } from "@ui-sdk/vue/menubar"
</script>

<template>
  <div data-slot="stack">
    <Menubar>
      <Menu>
        <MenuTrigger>File</MenuTrigger>
        <MenuContent>
          <MenuItem>New File</MenuItem>
          <MenuItem disabled>Revert File</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger disabled>Share</MenuTrigger>
        <MenuContent>
          <MenuItem>Email link</MenuItem>
        </MenuContent>
      </Menu>
    </Menubar>
    <Menubar disabled>
      <Menu v-for="label in ['Edit', 'View']" :key="label">
        <MenuTrigger>{{ label }}</MenuTrigger>
        <MenuContent>
          <MenuItem>Unavailable</MenuItem>
        </MenuContent>
      </Menu>
    </Menubar>
  </div>
</template>
