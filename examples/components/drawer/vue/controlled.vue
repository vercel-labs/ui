<script setup lang="ts">
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
  type SnapPoint,
} from "@ui-sdk/vue/drawer"
import { ref } from "vue"

const snapPoints: SnapPoint[] = [0.25, 0.5, 1]

const open = ref(false)
const snapPoint = ref<SnapPoint>(0.5)
const log = ref<string[]>([])
const write = (line: string) => (log.value = [line, ...log.value].slice(0, 8))
const onOpenChange = (next: boolean, details: { reason: string }) =>
  write(`onOpenChange(${next}, "${details.reason}")`)
const onOpenChangeComplete = (next: boolean) => write(`onOpenChangeComplete(${next})`)
const onSnapPointChange = (next: SnapPoint, details: { reason: string }) =>
  write(`onSnapPointChange(${next}, "${details.reason}")`)
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <label data-slot="label">
        <input v-model="open" type="checkbox" />
        open
      </label>
      <fieldset data-slot="row">
        <legend>snapPoint</legend>
        <label data-slot="label" v-for="point in snapPoints" :key="point">
          <input v-model="snapPoint" type="radio" name="controlled-snap-point" :value="point" />
          {{ point }}
        </label>
      </fieldset>
    </div>
    <Drawer
      v-model:open="open"
      v-model:snap-point="snapPoint"
      :snap-points="snapPoints"
      @open-change="onOpenChange"
      @open-change-complete="onOpenChangeComplete"
      @snap-point-change="onSnapPointChange"
    >
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHandle aria-label="Resize" />
        <div data-slot="stack">
          <DrawerTitle>Controlled</DrawerTitle>
          <DrawerDescription
            >Open at {{ snapPoint }}. Drag it, or pick a size, and watch the log.</DrawerDescription
          >
        </div>
        <div data-slot="row">
          <button
            v-for="point in snapPoints"
            :key="point"
            type="button"
            :aria-pressed="snapPoint === point"
            @click="snapPoint = point"
          >
            {{ point }}
          </button>
          <DrawerClose data-variant="solid">Close</DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
    <p data-slot="hint">open: {{ open }}, snapPoint: {{ snapPoint }}</p>
    <ol data-slot="log">
      <li v-for="(line, index) in log" :key="index">{{ line }}</li>
    </ol>
  </div>
</template>
