<script setup lang="ts">
import { ChevronRightIcon, DownloadIcon, LinkIcon, ShareIcon, TrashIcon } from "@lucide/vue"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { ref } from "vue"

const action = ref("")
</script>

<template>
  <div data-slot="stack">
    <Menu presentation="sheet" @action="(value: string) => (action = value)">
      <MenuTrigger>Options</MenuTrigger>
      <MenuContent>
        <MenuItem value="share">
          <ShareIcon />
          Share
        </MenuItem>
        <MenuItem value="copy-link">
          <LinkIcon />
          Copy link
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger>
            <DownloadIcon />
            Move to
            <ChevronRightIcon aria-hidden="true" />
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem value="inbox">Inbox</MenuItem>
            <MenuItem value="archive">Archive</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuItem value="delete" destructive>
          <TrashIcon aria-hidden="true" />
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
    <output data-slot="output">{{ action ? `Ran ${action}` : "Opens as a sheet" }}</output>
  </div>
</template>
