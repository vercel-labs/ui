<script setup lang="ts">
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/vue/dialog"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/vue/drawer"
import { onBeforeUnmount, onMounted, ref } from "vue"

const isDesktop = ref(false)
let query: MediaQueryList | undefined
const update = () => (isDesktop.value = !!query?.matches)

onMounted(() => {
  query = window.matchMedia("(min-width: 768px)")
  update()
  query.addEventListener("change", update)
})
onBeforeUnmount(() => query?.removeEventListener("change", update))
</script>

<template>
  <Dialog v-if="isDesktop">
    <DialogTrigger>Edit profile</DialogTrigger>
    <DialogBackdrop />
    <DialogContent>
      <div data-slot="stack">
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Make changes to your profile here. Save when you're done.</DialogDescription>
      </div>
      <div data-slot="stack">
        <label data-slot="label">
          Email
          <input type="email" value="shadcn@example.com" />
        </label>
        <label data-slot="label">
          Username
          <input value="@shadcn" />
        </label>
      </div>
      <DialogClose data-variant="solid">Save changes</DialogClose>
    </DialogContent>
  </Dialog>
  <Drawer v-else>
    <DrawerTrigger>Edit profile</DrawerTrigger>
    <DrawerBackdrop />
    <DrawerContent>
      <div data-slot="grip" aria-hidden="true" />
      <div data-slot="stack">
        <DrawerTitle>Edit profile</DrawerTitle>
        <DrawerDescription>Make changes to your profile here. Save when you're done.</DrawerDescription>
      </div>

      <div data-slot="stack">
        <label data-slot="label">
          Email
          <input type="email" value="shadcn@example.com" />
        </label>
        <label data-slot="label">
          Username
          <input value="@shadcn" />
        </label>
      </div>

      <div data-slot="stack">
        <DrawerClose data-variant="solid">Save changes</DrawerClose>
        <DrawerClose>Cancel</DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
</template>
