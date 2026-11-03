<script setup lang="ts">
import { createMenubarController, Menubar } from "@ui-sdk/vue/menubar"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue/menu"
import { useShortcut } from "@ui-sdk/vue/shortcuts"
import { ref } from "vue"

const menubar = createMenubarController()

const open = ref("none")
useShortcut("alt+m", () => menubar.focus())
</script>

<template>
  <div data-slot="stack">
    <Menubar :controller="menubar">
      <Menu
        v-for="label in ['File', 'Edit']"
        :key="label"
        @open-change="(next: boolean) => (open = next ? label : 'none')"
      >
        <MenuTrigger>{{ label }}</MenuTrigger>
        <MenuContent>
          <MenuItem :close-on-select="false" @select="menubar.close()"> Close from the controller </MenuItem>
        </MenuContent>
      </Menu>
    </Menubar>
    <div data-slot="row">
      <button type="button" @click="menubar.focus()">Focus menubar</button>
      <output data-slot="output">Open: {{ open }} · Alt+M focuses it too</output>
    </div>
  </div>
</template>
