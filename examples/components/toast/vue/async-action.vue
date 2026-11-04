<script setup lang="ts">
import { onUnmounted } from "vue"
import { Toast, ToastAction, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/vue/toast"

const toast = createToaster({ duration: 4000 })

const restore = () => new Promise((resolve) => setTimeout(resolve, 1500))
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <button @click="toast('File deleted', { action: { label: 'Undo', onAction: restore } })">
    Delete file
  </button>
  <ToastRegion :toaster="toast">
    <template #default>
      <Toast>
        <ToastTitle />
        <ToastAction v-slot="{ state }">
          {{ state.pending ? "Restoring…" : state.error ? "Try again" : "Undo" }}
        </ToastAction>
      </Toast>
    </template>
  </ToastRegion>
</template>
