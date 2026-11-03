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
const note = ref("")
const asking = ref(false)
const saved = ref(false)
const field = ref<HTMLTextAreaElement | null>(null)

function close() {
  open.value = false
  asking.value = false
}

function keepEditing() {
  asking.value = false
  field.value?.focus()
}

function discard() {
  note.value = ""
  close()
}

function save() {
  saved.value = true
  note.value = ""
  close()
}
</script>

<template>
  <Popover
    :open="open"
    :dismissible="note === ''"
    @update:open="(next: boolean) => (next ? (open = true) : close())"
    @dismiss-attempt="asking = true"
  >
    <PopoverTrigger>Add note</PopoverTrigger>
    <PopoverContent>
      <PopoverTitle>Note</PopoverTitle>
      <PopoverDescription>Type something, then press Escape or click outside.</PopoverDescription>
      <textarea ref="field" v-model="note" aria-label="Note" />
      <div v-if="asking" role="alert" data-slot="row">
        Discard your note?
        <button type="button" data-size="sm" @click="keepEditing">Keep editing</button>
        <button type="button" data-size="sm" data-variant="destructive" @click="discard">Discard</button>
      </div>
      <button v-else type="button" data-variant="solid" @click="save">Save</button>
    </PopoverContent>
  </Popover>
  <output data-slot="output">{{ saved ? "Note saved" : "No note yet" }}</output>
</template>
