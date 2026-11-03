<script setup lang="ts">
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerOutlet,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/vue/drawer"

const messages = [
  { from: "Ada", text: "The proofs are back from the printer." },
  { from: "Grace", text: "Lunch on Thursday?" },
  { from: "Linus", text: "Pushed the fix for the release build." },
  { from: "Margaret", text: "Can you review the launch checklist?" },
]
</script>

<template>
  <Drawer>
    <div>
      <DrawerOutlet :keyframes="{ scale: [1, 0.94], borderRadius: ['0px', '24px'] }">
        <div data-slot="row">
          <span>Inbox</span>
          <DrawerTrigger data-variant="solid">Compose</DrawerTrigger>
        </div>
        <ul data-slot="list">
          <li v-for="message in messages" :key="message.from">
            <div>{{ message.from }}</div>
            <div data-slot="hint">{{ message.text }}</div>
          </li>
        </ul>
      </DrawerOutlet>
    </div>
    <DrawerBackdrop />
    <DrawerContent>
      <div data-slot="grip" aria-hidden="true" />
      <div data-slot="stack">
        <DrawerTitle>New message</DrawerTitle>
        <DrawerDescription>Drag it down slowly and watch the inbox follow.</DrawerDescription>
      </div>
      <div data-slot="stack">
        <input aria-label="To" placeholder="To" />
        <textarea aria-label="Message" placeholder="Message" />
      </div>
      <div data-slot="stack">
        <DrawerClose data-variant="solid" value="send">Send</DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
</template>
