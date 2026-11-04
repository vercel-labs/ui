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

const toast = createToaster()
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <button @click="toast('Press Alt+T to reach this toast', { action: { label: 'Open' } })">Show toast</button>
  <ToastRegion :toaster="toast" shortcut="alt+t" aria-label="Alerts">
    <template #default="{ toast: item }">
      <Toast>
        <div data-slot="stack">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastClose />
      </Toast>
    </template>
  </ToastRegion>
</template>
