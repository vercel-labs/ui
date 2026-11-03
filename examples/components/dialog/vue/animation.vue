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

const status = ref("Closed")
</script>

<template>
  <Dialog
    @open-change="(open: boolean) => (status = open ? 'Opening' : 'Closing')"
    @open-change-complete="(open: boolean) => (status = open ? 'Open' : 'Closed')"
  >
    <DialogTrigger>Slide in</DialogTrigger>
    <DialogBackdrop />
    <DialogContent keep-mounted>
      <div data-slot="stack">
        <DialogTitle>Slide and fade</DialogTitle>
        <DialogDescription>300ms in and out. Focus returns as soon as it starts closing.</DialogDescription>
      </div>
      <div data-slot="row">
        <DialogClose data-variant="solid">Close</DialogClose>
      </div>
    </DialogContent>
  </Dialog>
  <output data-slot="output">{{ status }}</output>
</template>
