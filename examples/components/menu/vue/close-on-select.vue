<script setup lang="ts">
import { CheckIcon, MonitorIcon, ZoomInIcon, ZoomOutIcon } from "@lucide/vue"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { ref } from "vue"

const zoom = ref(100)
const fit = ref(false)
</script>

<template>
  <Menu>
    <MenuTrigger :aria-label="fit ? 'Zoom to fit' : `Zoom ${zoom}%`">
      <ZoomInIcon />
      {{ fit ? "Fit" : `${zoom}%` }}
    </MenuTrigger>
    <MenuContent>
      <MenuGroup>
        <MenuGroupLabel>Zoom {{ zoom }}%</MenuGroupLabel>
        <MenuItem :close-on-select="false" :disabled="zoom >= 200" @select="zoom = Math.min(200, zoom + 10)">
          <ZoomInIcon />
          Zoom in
        </MenuItem>
        <MenuItem :close-on-select="false" :disabled="zoom <= 50" @select="zoom = Math.max(50, zoom - 10)">
          <ZoomOutIcon />
          Zoom out
        </MenuItem>
        <MenuItem @select="zoom = 100"> Reset to 100% </MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuCheckboxItem v-model:checked="fit" value="fit" close-on-select>
        <MonitorIcon />
        Fit to window
        <CheckIcon aria-hidden="true" />
      </MenuCheckboxItem>
    </MenuContent>
  </Menu>
</template>
