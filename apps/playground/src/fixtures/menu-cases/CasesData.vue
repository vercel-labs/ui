<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Menu,
  MenuTrigger,
} from "@ui-sdk/vue"
import { computed, ref } from "vue"
import { casesData } from "./data"

const action = ref("")
const align = ref("left")
const journal = ref(false)
const shortcuts = ref(true)
const items = computed(() =>
  casesData({ align: align.value, journal: journal.value })
)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Menu
      :items="items"
      :item-shortcuts="shortcuts"
      @action="(value: string) => (action = value)"
    >
      <MenuTrigger>Edit</MenuTrigger>
    </Menu>
    <button @click="align = 'right'">Align right</button>
    <button @click="journal = true">Add journal</button>
    <button @click="shortcuts = false">Turn off shortcuts</button>
    <button>After</button>
    <input aria-label="Notes" />
    <Dialog>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent class="dialog">
        <DialogTitle class="title">Settings</DialogTitle>
        <DialogClose>Close</DialogClose>
      </DialogContent>
    </Dialog>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
