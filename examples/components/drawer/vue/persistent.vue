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

const chat = ref<HTMLButtonElement | null>(null)
const messages = ref(0)

function onOpenChange(open: boolean) {
  if (open) requestAnimationFrame(() => chat.value?.showPopover())
  else chat.value?.hidePopover()
}
</script>

<template>
  <Drawer :persistent-elements="() => (chat ? [chat] : [])" @open-change="onOpenChange">
    <DrawerTrigger>Upgrade plan</DrawerTrigger>
    <DrawerBackdrop />
    <DrawerContent>
      <div data-slot="grip" aria-hidden="true" />
      <div data-slot="stack">
        <DrawerTitle>Upgrade to Pro</DrawerTitle>
        <DrawerDescription>Questions? The chat in the corner still works.</DrawerDescription>
      </div>
      <div data-slot="stack">
        <DrawerClose data-variant="solid" value="upgrade">Upgrade</DrawerClose>
        <DrawerClose>Not now</DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
  <button data-variant="solid" ref="chat" type="button" popover="manual" @click="messages++">
    Chat with us{{ messages ? ` (${messages})` : "" }}
  </button>
</template>
