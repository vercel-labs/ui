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
import { Field, FieldControl, FieldLabel } from "@ui-sdk/vue/field"

const messages = [
  { from: "Inès", text: "The proofs are back from the printer." },
  { from: "Kofi", text: "Lunch on Thursday?" },
  { from: "Wren", text: "Pushed the fix for the release build." },
  { from: "Tomasz", text: "Can you review the launch checklist?" },
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
        <DrawerDescription>Write a quick note to the team.</DrawerDescription>
      </div>
      <Field>
        <FieldLabel>To</FieldLabel>
        <FieldControl defaultValue="Design team" />
      </Field>
      <Field>
        <FieldLabel>Message</FieldLabel>
        <FieldControl>
          <template #render="{ props }">
            <textarea v-bind="props" placeholder="What's new?" />
          </template>
        </FieldControl>
      </Field>
      <div data-slot="stack">
        <DrawerClose data-variant="solid" value="send">Send</DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
</template>
