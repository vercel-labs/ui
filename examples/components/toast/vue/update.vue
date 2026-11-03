<script setup lang="ts">
import { onUnmounted } from "vue"
import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/vue/toast"

const toast = createToaster()

let timer: ReturnType<typeof setInterval> | undefined

function upload() {
  clearInterval(timer)
  const id = toast.loading("Uploading… 0%", { id: "upload" })
  let progress = 0
  timer = setInterval(() => {
    progress += 25
    const done = progress >= 100
    const open = toast.update(
      id,
      done ? { title: "Upload complete", type: "success" } : { title: `Uploading… ${progress}%` },
    )
    if (done || !open) clearInterval(timer)
  }, 600)
}
onUnmounted(() => {
  clearInterval(timer)
  toast.dismiss()
})
</script>

<template>
  <div data-slot="row">
    <button data-variant="secondary" @click="upload">Upload</button>
    <button data-variant="secondary" @click="toast.dismiss('upload')">Cancel upload</button>
    <button data-variant="secondary" @click="toast.dismiss()">Dismiss all</button>
  </div>
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
