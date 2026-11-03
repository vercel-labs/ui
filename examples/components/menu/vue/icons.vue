<script setup lang="ts">
import { DownloadIcon, LinkIcon, MailIcon, ReplyIcon, ShareIcon } from "@lucide/vue"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuSeparator, MenuTrigger } from "@ui-sdk/vue/menu"
import { ref } from "vue"

const action = ref("")
</script>

<template>
  <div data-slot="stack">
    <Menu @action="(value: string) => (action = value)">
      <MenuTrigger>
        <ShareIcon />
        Share
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="copy-link">
          <MenuItemIcon>
            <LinkIcon />
          </MenuItemIcon>
          Copy link
        </MenuItem>
        <MenuItem value="email">
          <MenuItemIcon>
            <MailIcon />
          </MenuItemIcon>
          Email
        </MenuItem>
        <MenuItem value="reply">
          <MenuItemIcon mirror>
            <ReplyIcon />
          </MenuItemIcon>
          Reply
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="download">
          <MenuItemIcon>
            <DownloadIcon />
          </MenuItemIcon>
          Download
        </MenuItem>
        <MenuItem value="embed">Embed</MenuItem>
      </MenuContent>
    </Menu>
    <output data-slot="output">{{ action ? `Ran ${action}` : "Pick an item" }}</output>
  </div>
</template>
