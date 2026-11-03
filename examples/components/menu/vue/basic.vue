<script setup lang="ts">
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { ref } from "vue"

const action = ref("")
</script>

<template>
  <div data-slot="stack">
    <Menu @action="(value: string) => (action = value)">
      <MenuTrigger>Project</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>Project</MenuGroupLabel>
          <MenuItem value="overview">Overview</MenuItem>
          <MenuItem value="members">Members</MenuItem>
          <MenuItem value="settings">Settings</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Help</MenuGroupLabel>
          <MenuItem value="docs">Documentation</MenuItem>
          <MenuItem value="feedback">Send feedback</MenuItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
    <output data-slot="output">{{ action ? `Ran ${action}` : "Pick an item" }}</output>
  </div>
</template>
