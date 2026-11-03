<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue/popover"
import { ref } from "vue"

const open = ref(false)
const name = ref("Ada Lovelace")
const saved = ref("")

function save() {
  saved.value = name.value
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger>Edit profile</PopoverTrigger>
    <PopoverContent>
      <PopoverTitle>Profile</PopoverTitle>
      <PopoverDescription>Your name appears on your posts.</PopoverDescription>
      <form data-slot="stack" @submit.prevent="save">
        <label data-slot="label">
          Name
          <input v-model="name" />
        </label>
        <button type="submit" data-variant="solid">Save</button>
      </form>
    </PopoverContent>
  </Popover>
  <output data-slot="output">{{ saved ? `Saved ${saved}` : "Not saved yet" }}</output>
</template>
