<script setup lang="ts">
import { LinkIcon, MailIcon, SaveIcon, ShareIcon } from "@lucide/vue"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuTrigger } from "@ui-sdk/vue/menu"
import { Toolbar, ToolbarButton } from "@ui-sdk/vue/toolbar"
import { ref } from "vue"

const action = ref("nothing yet")
</script>

<template>
  <div data-slot="stack">
    <Toolbar aria-label="Document">
      <ToolbarButton data-variant="secondary" @click="action = 'save'">
        <SaveIcon />
        Save
      </ToolbarButton>
      <Menu @action="(value: string) => (action = value)">
        <ToolbarButton data-variant="secondary">
          <template #render="{ props }">
            <MenuTrigger v-bind="props">
              <ShareIcon />
              Share
            </MenuTrigger>
          </template>
        </ToolbarButton>
        <MenuContent>
          <MenuItem value="email">
            <MenuItemIcon>
              <MailIcon />
            </MenuItemIcon>
            Email
          </MenuItem>
          <MenuItem value="link">
            <MenuItemIcon>
              <LinkIcon />
            </MenuItemIcon>
            Copy link
          </MenuItem>
        </MenuContent>
      </Menu>
      <ToolbarButton data-variant="secondary" @click="action = 'print'">Print</ToolbarButton>
    </Toolbar>
    <output data-slot="output">Last: {{ action }}</output>
  </div>
</template>
