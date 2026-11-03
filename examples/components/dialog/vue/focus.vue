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

const next = ref<HTMLButtonElement | null>(null)
</script>

<template>
  <div data-slot="row">
    <Dialog>
      <DialogTrigger>Invite</DialogTrigger>
      <DialogBackdrop />
      <DialogContent initial-focus="[name=email]" :final-focus="() => next">
        <div data-slot="stack">
          <DialogTitle>Invite a teammate</DialogTitle>
          <DialogDescription>Focus starts on the email.</DialogDescription>
        </div>
        <div data-slot="stack">
          <label data-slot="label">
            Name
            <input name="name" value="Ada" />
          </label>
          <label data-slot="label">
            Email
            <input name="email" type="email" />
          </label>
        </div>
        <div data-slot="row">
          <DialogClose data-variant="solid">Send invite</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
    <button ref="next" type="button">Next step</button>
  </div>
</template>
