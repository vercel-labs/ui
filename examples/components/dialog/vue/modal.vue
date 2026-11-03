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
import { computed, ref } from "vue"

const modes = [
  { value: "true", label: "Modal" },
  { value: "trap-focus", label: "Trap focus" },
  { value: "false", label: "Non-modal" },
] as const

const notes = {
  true: "The rest of the page is inert and doesn't scroll.",
  "trap-focus": "Tab stays inside, and the page still scrolls and takes clicks.",
  false: "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside.",
}

const mode = ref<(typeof modes)[number]["value"]>("false")
const outside = ref(false)
const modal = computed(() => (mode.value === "true" ? true : mode.value === "false" ? false : "trap-focus"))
</script>

<template>
  <div data-slot="stack">
    <fieldset data-slot="row">
      <legend>modal</legend>
      <label data-slot="label" v-for="option in modes" :key="option.value">
        <input v-model="mode" type="radio" name="modal" :value="option.value" />
        {{ option.label }}
      </label>
      <label data-slot="label">
        <input v-model="outside" type="checkbox" />
        closeOnOutsidePress
      </label>
    </fieldset>
    <Dialog :modal="modal" :close-on-outside-press="outside">
      <DialogTrigger>Open notes</DialogTrigger>
      <DialogBackdrop v-if="modal === true" />
      <DialogContent>
        <div data-slot="stack">
          <DialogTitle>Notes</DialogTitle>
          <DialogDescription>{{ notes[mode] }}</DialogDescription>
        </div>
        <textarea aria-label="Notes">Call the printer about the proofs.</textarea>
        <DialogClose>Done</DialogClose>
      </DialogContent>
    </Dialog>
  </div>
</template>
