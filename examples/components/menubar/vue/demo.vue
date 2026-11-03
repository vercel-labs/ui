<script setup lang="ts">
import { CheckIcon, ChevronRightIcon } from "@lucide/vue"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { Menubar } from "@ui-sdk/vue/menubar"

const profiles = [
  { value: "hollis", label: "Hollis" },
  { value: "ines", label: "Inès" },
  { value: "kofi", label: "Kofi" },
]
</script>

<template>
  <Menubar>
    <Menu>
      <MenuTrigger>File</MenuTrigger>
      <MenuContent>
        <MenuItem shortcut="mod+t">New Tab</MenuItem>
        <MenuItem shortcut="mod+n">New Window</MenuItem>
        <MenuItem disabled>New Incognito Window</MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>
            Share
            <ChevronRightIcon aria-hidden="true" />
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>Email link</MenuItem>
            <MenuItem>Messages</MenuItem>
            <MenuItem>Notes</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuItem shortcut="mod+p">Print…</MenuItem>
      </MenuContent>
    </Menu>
    <Menu>
      <MenuTrigger>Edit</MenuTrigger>
      <MenuContent>
        <MenuItem shortcut="mod+z">Undo</MenuItem>
        <MenuItem shortcut="mod+shift+z">Redo</MenuItem>
        <MenuSeparator />
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </MenuContent>
    </Menu>
    <Menu>
      <MenuTrigger>View</MenuTrigger>
      <MenuContent>
        <MenuCheckboxItem value="bookmarks">
          <MenuItemIndicator>
            <CheckIcon aria-hidden="true" />
          </MenuItemIndicator>
          Always Show Bookmarks Bar
        </MenuCheckboxItem>
        <MenuCheckboxItem value="urls" default-checked>
          <MenuItemIndicator>
            <CheckIcon aria-hidden="true" />
          </MenuItemIndicator>
          Always Show Full URLs
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuItem shortcut="mod+r">Reload</MenuItem>
        <MenuItem>Toggle Fullscreen</MenuItem>
      </MenuContent>
    </Menu>
    <Menu>
      <MenuTrigger>Profiles</MenuTrigger>
      <MenuContent>
        <MenuRadioGroup default-value="ines">
          <MenuRadioItem v-for="profile in profiles" :key="profile.value" :value="profile.value">
            <MenuItemIndicator />
            {{ profile.label }}
          </MenuRadioItem>
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuItem>Edit…</MenuItem>
        <MenuItem>Add Profile…</MenuItem>
      </MenuContent>
    </Menu>
  </Menubar>
</template>
