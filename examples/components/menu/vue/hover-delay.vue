<script setup lang="ts">
import { ChevronRightIcon } from "@lucide/vue"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/vue/menu"

const menus = [
  { name: "Instant", delay: 0 },
  { name: "Default", delay: 100 },
  { name: "Slow", delay: 500 },
]

const submenus = [
  { label: "Open recent", items: ["report.pdf", "notes.md"] },
  { label: "Share", items: ["Email", "Copy link"] },
]
</script>

<template>
  <div data-slot="row">
    <Menu v-for="menu in menus" :key="menu.name" :delay="menu.delay">
      <MenuTrigger>{{ menu.name }}</MenuTrigger>
      <MenuContent>
        <MenuItem>New file</MenuItem>
        <MenuSub v-for="submenu in submenus" :key="submenu.label">
          <MenuSubTrigger>
            {{ submenu.label }}
            <ChevronRightIcon aria-hidden="true" />
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem v-for="label in submenu.items" :key="label">{{ label }}</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuItem>Close</MenuItem>
      </MenuContent>
    </Menu>
  </div>
</template>
