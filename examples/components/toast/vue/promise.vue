<script setup lang="ts">
import { onUnmounted } from "vue"
import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/vue/toast"

const toast = createToaster()

let requests = 0

function save() {
  const succeeds = ++requests % 2 === 1
  return new Promise<{ name: string }>((resolve, reject) =>
    setTimeout(() => (succeeds ? resolve({ name: "report.pdf" }) : reject(new Error("Network error"))), 1500),
  )
}

function start() {
  toast.promise(save, {
    loading: "Saving…",
    success: (file) => ({ title: "Saved", description: file.name }),
    error: (error) => ({ title: "Could not save", description: (error as Error).message }),
  })
}
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <button data-variant="secondary" @click="start">Save</button>
  <ToastRegion :toaster="toast">
    <template #default="{ toast: item }">
      <Toast>
        <div data-slot="stack">
          <ToastTitle />
          <ToastDescription />
        </div>
      </Toast>
    </template>
  </ToastRegion>
</template>
