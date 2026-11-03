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

const open = ref(false)
const log = ref<string[]>([])
const write = (line: string) => (log.value = [line, ...log.value].slice(0, 8))
const onOpenChange = (next: boolean, details: { reason: string }) =>
  write(`onOpenChange(${next}, "${details.reason}")`)
const onOpenChangeComplete = (next: boolean) => write(`onOpenChangeComplete(${next})`)
</script>

<template>
  <label data-slot="label">
    <input v-model="open" type="checkbox" />
    open
  </label>
  <Dialog v-model:open="open" @open-change="onOpenChange" @open-change-complete="onOpenChangeComplete">
    <DialogTrigger>Open</DialogTrigger>
    <DialogBackdrop />
    <DialogContent>
      <div data-slot="stack">
        <DialogTitle>Controlled</DialogTitle>
        <DialogDescription>Close it any way you like, and watch the log.</DialogDescription>
      </div>
      <div data-slot="row">
        <DialogClose data-variant="solid">Close</DialogClose>
      </div>
    </DialogContent>
  </Dialog>
  <ol data-slot="log">
    <li v-for="(line, index) in log" :key="index">{{ line }}</li>
  </ol>
</template>
