<script setup lang="ts">
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/vue"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// Many dialogs on one page, like a delete confirmation in every row of a
// table, for the counts specs. Only the first one is opened.
const items = perfItems(perfSize())
</script>

<template>
  <div class="fixture" style="flex-wrap: wrap">
    <button>Before</button>
    <Dialog v-for="item in items" :key="item.value">
      <DialogTrigger>Delete {{ item.label }}</DialogTrigger>
      <DialogBackdrop class="dialog-backdrop" />
      <DialogContent class="dialog">
        <DialogTitle class="title">Delete {{ item.label }}?</DialogTitle>
        <DialogDescription class="description"
          >This can't be undone.</DialogDescription
        >
        <div class="actions">
          <DialogClose>Cancel</DialogClose>
          <button>Delete</button>
        </div>
      </DialogContent>
    </Dialog>
    <button>After</button>
  </div>
</template>
