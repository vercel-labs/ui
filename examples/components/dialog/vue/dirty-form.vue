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
const dirty = ref(false)
const asking = ref(false)
const post = ref<HTMLTextAreaElement | null>(null)

function close() {
  open.value = false
  dirty.value = false
  asking.value = false
}

function keepEditing() {
  asking.value = false
  post.value?.focus()
}
</script>

<template>
  <Dialog
    :open="open"
    :dismissible="!dirty"
    @update:open="(next: boolean) => (next ? (open = true) : close())"
    @dismiss-attempt="asking = true"
  >
    <DialogTrigger>Write a post</DialogTrigger>
    <DialogBackdrop />
    <DialogContent>
      <div data-slot="stack">
        <DialogTitle>New post</DialogTitle>
        <DialogDescription>Type something, then press Escape or click outside.</DialogDescription>
      </div>
      <textarea
        ref="post"
        aria-label="Post"
        @input="dirty = ($event.target as HTMLTextAreaElement).value !== ''"
      />
      <div data-slot="row" v-if="asking" role="alert">
        Discard your changes?
        <div data-slot="row">
          <button type="button" @click="keepEditing">Keep editing</button>
          <button data-variant="solid" type="button" @click="close">Discard</button>
        </div>
      </div>
      <div data-slot="row" v-else>
        <DialogClose data-variant="solid" value="post">Post</DialogClose>
      </div>
    </DialogContent>
  </Dialog>
</template>
