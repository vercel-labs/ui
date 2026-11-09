<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  OverlayHost,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  confirm,
  type ToastContent,
} from "@ui-sdk/vue"
import { ref } from "vue"
import { toastFixture, toastOptions, usesHost } from "tests/fixtures/toast.ts"
import { createFixtureToasts } from "./shared"

const action = ref("")
const toasts = createFixtureToasts<ToastContent>(
  (value) => (action.value = value)
)
const host = usesHost()
const options = toastOptions()

async function ask() {
  const { title, confirm: confirmLabel, cancel } = toastFixture.confirm
  const yes = await confirm({ title, confirmLabel, cancelLabel: cancel })
  action.value = yes ? "confirmed" : "declined"
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <button @click="toasts.basic">{{ toastFixture.basic.trigger }}</button>
    <button @click="toasts.success">{{ toastFixture.success.trigger }}</button>
    <button @click="toasts.error">{{ toastFixture.error.trigger }}</button>
    <button @click="toasts.promise">{{ toastFixture.promise.trigger }}</button>
    <Dialog>
      <DialogTrigger>{{ toastFixture.dialog.trigger }}</DialogTrigger>
      <DialogContent class="dialog">
        <DialogTitle class="title">{{ toastFixture.dialog.title }}</DialogTitle>
        <button @click="toasts.basic">{{ toastFixture.dialog.toast }}</button>
        <DialogClose>{{ toastFixture.dialog.close }}</DialogClose>
      </DialogContent>
    </Dialog>
    <button v-if="host" @click="ask">{{ toastFixture.confirm.trigger }}</button>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <OverlayHost v-if="host" :toast="{ ...options, class: 'toast-region' }">
      <template #toast="{ toast }">
        <Toast class="toast">
          <ToastTitle />
          <ToastDescription />
          <ToastAction />
          <ToastClose v-if="toast.cancel" :action="toast.cancel.onCancel">{{
            toast.cancel.label
          }}</ToastClose>
        </Toast>
      </template>
    </OverlayHost>
    <ToastRegion
      v-else
      :toaster="toasts.toast"
      class="toast-region"
      v-bind="options"
    >
      <Toast class="toast">
        <ToastTitle class="toast-title" />
        <ToastDescription class="toast-description" />
        <ToastAction class="toast-action" />
        <ToastClose class="toast-close">{{ toastFixture.dismiss }}</ToastClose>
      </Toast>
    </ToastRegion>
  </div>
</template>
