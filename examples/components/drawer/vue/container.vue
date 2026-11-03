<script setup lang="ts">
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/vue/drawer"
import { ref } from "vue"

const container = ref<HTMLDivElement | null>(null)
</script>

<template>
  <Drawer :container="container">
    <DrawerTrigger>Open in the box</DrawerTrigger>
    <DrawerBackdrop />
    <DrawerContent>
      <div data-slot="grip" aria-hidden="true" />
      <div data-slot="stack">
        <DrawerTitle>Portaled</DrawerTitle>
        <DrawerDescription>This drawer is in the box below, in the DOM.</DrawerDescription>
      </div>
      <div data-slot="stack">
        <DrawerClose data-variant="solid">Close</DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
  <div data-slot="stack">
    Container
    <div ref="container" />
  </div>
</template>
