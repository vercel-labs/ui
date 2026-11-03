<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { reactive } from "vue"

const choices = {
  sideOffset: [0, 8, 24],
  alignOffset: [-16, 0, 16],
  collisionPadding: [8, 48],
}
const offsets = reactive({ sideOffset: 8, alignOffset: 0, collisionPadding: 8 })
</script>

<template>
  <div data-slot="stack">
    <div data-slot="stack">
      <div v-for="(values, name) in choices" :key="name" data-slot="row" role="group" :aria-label="name">
        <button
          v-for="value in values"
          :key="value"
          type="button"
          data-size="sm"
          :aria-pressed="offsets[name] === value"
          @click="offsets[name] = value"
        >
          {{ name }} {{ value }}
        </button>
      </div>
    </div>
    <Popover>
      <PopoverTrigger>Offsets</PopoverTrigger>
      <PopoverContent
        align="start"
        :side-offset="offsets.sideOffset"
        :align-offset="offsets.alignOffset"
        :collision-padding="offsets.collisionPadding"
      >
        <PopoverTitle>Offsets</PopoverTitle>
        <PopoverDescription>
          {{ offsets.sideOffset }}px from the trigger, shifted {{ offsets.alignOffset }}px,
          {{ offsets.collisionPadding }}px from the edges.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  </div>
</template>
