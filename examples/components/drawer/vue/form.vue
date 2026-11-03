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

const profile = ref({ name: "Pedro Duarte", username: "@peduarte" })
const summary = ref<HTMLDivElement | null>(null)
const form = ref<HTMLFormElement | null>(null)
let tries = 0

async function save() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  tries++
  if (tries === 1) throw new Error("The server didn't answer.")
  const data = new FormData(form.value ?? undefined)
  profile.value = { name: String(data.get("name")), username: String(data.get("username")) }
}
</script>

<template>
  <div data-slot="stack">
    <div ref="summary" tabindex="-1">
      <div>{{ profile.name }}</div>
      <div data-slot="hint">{{ profile.username }}</div>
    </div>
    <Drawer>
      <DrawerTrigger>Edit profile</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent keep-mounted :final-focus="() => summary">
        <div data-slot="grip" aria-hidden="true" />
        <div data-slot="stack">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile here. Save when you're done.</DrawerDescription>
        </div>
        <form data-slot="stack" ref="form" @submit.prevent>
          <label data-slot="label">
            Name
            <input name="name" :value="profile.name" />
          </label>
          <label data-slot="label">
            Username
            <input name="username" :value="profile.username" />
          </label>
        </form>
        <div data-slot="stack">
          <DrawerClose data-variant="solid" v-slot="{ state }" value="save" @action="save">
            {{ state.pending ? "Saving…" : state.error ? "Couldn't save. Try again" : "Save changes" }}
          </DrawerClose>
          <DrawerClose>Cancel</DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
