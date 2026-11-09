<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue"
import { presentationOption } from "tests/fixtures/presentation.ts"

// One modal popup, picked with ?popup=dialog|alert-dialog|drawer|popover,
// rendered in place or into ?container=id, and as a sheet with
// ?presentation=sheet where it can be one.
const params = new URLSearchParams(location.search)
const container = params.has("container")
  ? document.getElementById(params.get("container")!)
  : undefined

const popups = {
  dialog: {
    Root: Dialog,
    Trigger: DialogTrigger,
    Backdrop: DialogBackdrop,
    Content: DialogContent,
    Title: DialogTitle,
    Close: DialogClose,
    options: presentationOption(),
    class: "dialog",
  },
  "alert-dialog": {
    Root: AlertDialog,
    Trigger: AlertDialogTrigger,
    Backdrop: AlertDialogBackdrop,
    Content: AlertDialogContent,
    Title: AlertDialogTitle,
    Close: AlertDialogClose,
    options: {},
    class: "dialog",
  },
  drawer: {
    Root: Drawer,
    Trigger: DrawerTrigger,
    Backdrop: DrawerBackdrop,
    Content: DrawerContent,
    Title: DrawerTitle,
    Close: DrawerClose,
    options: {},
    class: "drawer",
  },
  popover: {
    Root: Popover,
    Trigger: PopoverTrigger,
    Backdrop: undefined,
    Content: PopoverContent,
    Title: PopoverTitle,
    Close: PopoverClose,
    options: { modal: true, ...presentationOption() },
    class: "popup",
  },
}
const popup = popups[(params.get("popup") ?? "dialog") as keyof typeof popups]

const emit = defineEmits<{ leave: [] }>()
</script>

<template>
  <component :is="popup.Root" :container="container" v-bind="popup.options">
    <component :is="popup.Trigger">Edit profile</component>
    <component
      :is="popup.Backdrop"
      v-if="popup.Backdrop"
      class="dialog-backdrop"
    />
    <component :is="popup.Content" :class="popup.class">
      <component :is="popup.Title" class="title">Edit profile</component>
      <label class="field">
        Name
        <input />
      </label>
      <div class="actions">
        <button @click="emit('leave')">Leave page</button>
        <component :is="popup.Close">Close</component>
      </div>
    </component>
  </component>
</template>
