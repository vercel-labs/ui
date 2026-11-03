<script setup lang="ts">
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
  sheetPhysics,
  type SheetPhysics,
} from "@ui-sdk/vue/drawer"
import { ref } from "vue"

const presets: { label: string; physics: Partial<SheetPhysics> }[] = [
  { label: "iOS", physics: sheetPhysics.ios },
  { label: "Bouncy", physics: { dampingRatio: 0.6, momentumDampingRatio: 0.5 } },
  { label: "Slow", physics: { response: 0.7 } },
  { label: "Loose", physics: { rubberBand: 0.6, rubberBandDimension: null } },
]

const preset = ref(presets[1])
</script>

<template>
  <div data-slot="stack">
    <fieldset data-slot="row">
      <legend>physics</legend>
      <label data-slot="label" v-for="option in presets" :key="option.label">
        <input v-model="preset" type="radio" name="drawer-physics" :value="option" />
        {{ option.label }}
      </label>
    </fieldset>
    <Drawer :physics="preset.physics" :snap-points="[0.4, 1]" driver="pointer">
      <DrawerTrigger>Try the physics</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHandle aria-label="Resize" />
        <div data-slot="stack">
          <DrawerTitle>{{ preset.label }}</DrawerTitle>
          <DrawerDescription>Fling it up and down, and pull it past the top.</DrawerDescription>
        </div>
        <pre data-slot="log">{{ JSON.stringify({ ...sheetPhysics.ios, ...preset.physics }, null, 2) }}</pre>
      </DrawerContent>
    </Drawer>
  </div>
</template>
