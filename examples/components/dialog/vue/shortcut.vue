<script setup lang="ts">
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/vue/dialog"
import { FileIcon, SearchIcon } from "@lucide/vue"

const pages = ["Introduction", "Installation", "Dialog", "Alert Dialog", "Menu"]
</script>

<template>
  <Dialog>
    <DialogTrigger shortcut="mod+j">
      <SearchIcon aria-hidden="true" />
      Search docs
      <DialogShortcut />
    </DialogTrigger>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>Search docs</DialogTitle>
      <input aria-label="Search" placeholder="Search…" />
      <div data-slot="stack">
        <DialogClose v-for="page in pages" :key="page" :value="page">
          <FileIcon aria-hidden="true" />
          {{ page }}
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
</template>
