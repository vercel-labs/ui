<script setup lang="ts">
import { CheckIcon, ChevronsUpDownIcon, MonitorIcon, ZoomInIcon, ZoomOutIcon } from "@lucide/vue"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue/select"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/vue/toolbar"
import { computed, ref } from "vue"

const zooms = ["50%", "75%", "100%", "150%", "200%"]

const zoom = ref("100%")
const index = computed(() => zooms.indexOf(zoom.value))
</script>

<template>
  <Toolbar aria-label="View">
    <ToolbarButton
      data-variant="secondary"
      aria-label="Zoom out"
      :disabled="index === 0"
      @click="zoom = zooms[index - 1]"
    >
      <ZoomOutIcon />
    </ToolbarButton>
    <Select :value="zoom" @value-change="(value: unknown) => typeof value === 'string' && (zoom = value)">
      <ToolbarButton data-variant="secondary" aria-label="Zoom">
        <template #render="{ props }">
          <SelectTrigger v-bind="props">
            <SelectValue />
            <ChevronsUpDownIcon />
          </SelectTrigger>
        </template>
      </ToolbarButton>
      <SelectContent>
        <SelectItem v-for="zoom in zooms" :key="zoom" :value="zoom">
          {{ zoom }}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      </SelectContent>
    </Select>
    <ToolbarButton
      data-variant="secondary"
      aria-label="Zoom in"
      :disabled="index === zooms.length - 1"
      @click="zoom = zooms[index + 1]"
    >
      <ZoomInIcon />
    </ToolbarButton>
    <ToolbarSeparator />
    <ToolbarButton data-variant="secondary" aria-label="Fit to screen" @click="zoom = '100%'">
      <MonitorIcon />
    </ToolbarButton>
  </Toolbar>
</template>
