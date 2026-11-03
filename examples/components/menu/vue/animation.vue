<script setup lang="ts">
import { ChevronRightIcon } from "@lucide/vue"
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

const status = ref("Closed")
</script>

<template>
  <div data-slot="stack">
    <Menu
      @open-change="(open: boolean) => (status = open ? 'Opening' : 'Closing')"
      @open-change-complete="(open: boolean) => (status = open ? 'Open' : 'Closed')"
    >
      <MenuTrigger>Animated</MenuTrigger>
      <MenuContent keep-mounted>
        <MenuItem>Back</MenuItem>
        <MenuItem>Forward</MenuItem>
        <MenuItem>Reload</MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>
            More tools
            <ChevronRightIcon aria-hidden="true" />
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>Save page as…</MenuItem>
            <MenuItem>Developer tools</MenuItem>
          </MenuSubContent>
        </MenuSub>
      </MenuContent>
    </Menu>
    <output data-slot="output">{{ status }}</output>
  </div>
</template>
