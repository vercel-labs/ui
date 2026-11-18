<script setup lang="ts">
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/vue"
import { drawerOptions } from "tests/fixtures/drawer.ts"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// A drawer whose content has many lines, for the counts specs. ?driver picks its driver.
const items = perfItems(perfSize())
const options = drawerOptions()
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Drawer v-bind="options">
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerBackdrop class="drawer-backdrop" />
      <DrawerContent class="drawer">
        <DrawerTitle class="title">Drawer</DrawerTitle>
        <p v-for="item in items" :key="item.value">{{ item.label }}</p>
        <DrawerClose>Close</DrawerClose>
      </DrawerContent>
    </Drawer>
    <button>After</button>
  </div>
</template>
