<script setup lang="ts">
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/vue/drawer"
import { computed, ref } from "vue"

const modes = [
  { value: "true", label: "Modal" },
  { value: "trap-focus", label: "Trap focus" },
  { value: "false", label: "Non-modal" },
] as const

const mode = ref<(typeof modes)[number]["value"]>("false")
const outside = ref(false)
const modal = computed(() => (mode.value === "true" ? true : mode.value === "false" ? false : "trap-focus"))
</script>

<template>
  <div data-slot="stack">
    <fieldset data-slot="row">
      <legend>modal</legend>
      <label data-slot="label" v-for="option in modes" :key="option.value">
        <input v-model="mode" type="radio" name="drawer-modal" :value="option.value" />
        {{ option.label }}
      </label>
      <label data-slot="label">
        <input v-model="outside" type="checkbox" />
        closeOnOutsidePress
      </label>
    </fieldset>
    <Drawer :modal="modal" :close-on-outside-press="outside">
      <DrawerTrigger>Open notes</DrawerTrigger>
      <DrawerBackdrop v-if="modal === true" />
      <DrawerContent>
        <DrawerTitle>Notes</DrawerTitle>
        <DrawerDescription>
          {{
            modal === false
              ? "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside."
              : modal === true
                ? "The rest of the page is inert and doesn't scroll."
                : "Tab stays inside, and the page still scrolls and takes clicks."
          }}
        </DrawerDescription>
        <textarea aria-label="Notes" value="Call the printer about the proofs." />
        <DrawerClose data-variant="solid">Done</DrawerClose>
      </DrawerContent>
    </Drawer>
  </div>
</template>
