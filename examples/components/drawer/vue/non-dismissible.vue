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

const attempt = ref<string | null>(null)
</script>

<template>
  <Drawer
    :dismissible="false"
    @dismiss-attempt="(details: { reason: string }) => (attempt = details.reason)"
    @open-change="(open: boolean) => open && (attempt = null)"
  >
    <DrawerTrigger>Write a post</DrawerTrigger>
    <DrawerBackdrop />
    <DrawerContent>
      <div data-slot="grip" aria-hidden="true" />
      <div data-slot="stack">
        <DrawerTitle>New post</DrawerTitle>
        <DrawerDescription>Try to swipe it away, press outside it or press Escape.</DrawerDescription>
      </div>

      <textarea
        aria-label="Post"
        value="Shipped the new drawer today. It feels just like the system sheet."
      />

      <div data-slot="row" v-if="attempt" role="alert">
        <span>
          You have unsaved changes.
          <span data-slot="hint">Refused: {{ attempt }}</span>
        </span>
        <DrawerClose>Discard</DrawerClose>
      </div>

      <div data-slot="stack">
        <DrawerClose data-variant="solid" value="post">Post</DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
</template>
