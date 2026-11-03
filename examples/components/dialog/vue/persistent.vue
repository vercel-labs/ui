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

const chat = ref<HTMLButtonElement | null>(null)
const messages = ref(0)

function onOpenChange(open: boolean) {
  if (open) requestAnimationFrame(() => chat.value?.showPopover())
  else chat.value?.hidePopover()
}
</script>

<template>
  <Dialog :persistent-elements="() => (chat ? [chat] : [])" @open-change="onOpenChange">
    <DialogTrigger>Upgrade plan</DialogTrigger>
    <DialogBackdrop />
    <DialogContent>
      <div data-slot="stack">
        <DialogTitle>Upgrade to Pro</DialogTitle>
        <DialogDescription>Questions? The chat in the corner still works.</DialogDescription>
      </div>
      <div data-slot="row">
        <DialogClose>Not now</DialogClose>
        <DialogClose data-variant="solid" value="upgrade">Upgrade</DialogClose>
      </div>
    </DialogContent>
  </Dialog>
  <button data-variant="solid" ref="chat" type="button" popover="manual" @click="messages++">
    Chat with us{{ messages ? ` (${messages})` : "" }}
  </button>
</template>
