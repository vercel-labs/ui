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
import { ref } from "vue"

const container = ref<HTMLDivElement | null>(null)
</script>

<template>
  <Dialog :container="container">
    <DialogTrigger>Open in the box</DialogTrigger>
    <DialogBackdrop />
    <DialogContent>
      <div data-slot="stack">
        <DialogTitle>Portaled</DialogTitle>
        <DialogDescription>This dialog is in the box below, in the DOM.</DialogDescription>
      </div>
      <div data-slot="row">
        <DialogClose data-variant="solid">Close</DialogClose>
      </div>
    </DialogContent>
  </Dialog>
  <div data-slot="stack">
    Container
    <div ref="container" />
  </div>
</template>
