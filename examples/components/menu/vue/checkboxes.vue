<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { ref } from "vue"

const statusBar = ref(true)
const minimap = ref(false)
</script>

<template>
  <div data-slot="stack">
    <Menu>
      <MenuTrigger>View</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>Appearance</MenuGroupLabel>
          <MenuCheckboxItem v-model:checked="statusBar" value="status-bar">
            <MenuItemIndicator keep-mounted>
              <CheckIcon aria-hidden="true" />
            </MenuItemIndicator>
            Status bar
          </MenuCheckboxItem>
          <MenuCheckboxItem v-model:checked="minimap" value="minimap">
            <MenuItemIndicator keep-mounted>
              <CheckIcon aria-hidden="true" />
            </MenuItemIndicator>
            Minimap
          </MenuCheckboxItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem value="line-numbers" default-checked>
          <MenuItemIndicator keep-mounted>
            <CheckIcon aria-hidden="true" />
          </MenuItemIndicator>
          Line numbers
        </MenuCheckboxItem>
        <MenuCheckboxItem value="word-wrap">
          <MenuItemIndicator keep-mounted>
            <CheckIcon aria-hidden="true" />
          </MenuItemIndicator>
          Word wrap
        </MenuCheckboxItem>
      </MenuContent>
    </Menu>
    <output data-slot="output">
      Status bar {{ statusBar ? "shown" : "hidden" }}, minimap {{ minimap ? "shown" : "hidden" }}
    </output>
  </div>
</template>
