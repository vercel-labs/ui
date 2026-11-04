<script setup lang="ts">
import { onUnmounted } from "vue"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/vue/toast"

const toast = createToaster({ duration: 3000 })

function untilDismissed() {
  toast("Your session expires soon", {
    duration: Infinity,
    dismissible: false,
    cancel: { label: "Got it" },
  })
}
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <div data-slot="row">
    <button @click="toast('Copied', { duration: 1000 })">1 second</button>
    <button @click="toast('Saved')">3 seconds</button>
    <button @click="untilDismissed">Until dismissed</button>
  </div>
  <ToastRegion :toaster="toast">
    <template #default="{ toast: item }">
      <Toast>
        <div data-slot="stack">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastClose v-if="item.cancel" :action="item.cancel.onCancel">
          {{ item.cancel.label }}
        </ToastClose>
      </Toast>
    </template>
  </ToastRegion>
</template>
