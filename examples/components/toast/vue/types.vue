<script setup lang="ts">
import { onUnmounted } from "vue"
import { CircleCheckIcon, InfoIcon, LoaderCircleIcon, OctagonXIcon, TriangleAlertIcon } from "@lucide/vue"
import { Toast, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/vue/toast"

const toast = createToaster()

function promise() {
  toast.promise(
    new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({ name: "Event" }), 2000)),
    {
      loading: "Loading...",
      success: (data) => `${data.name} has been created`,
      error: "Error",
    },
  )
}
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <div data-slot="row">
    <button @click="toast('Event has been created')">Default</button>
    <button @click="toast.success('Event has been created')">Success</button>
    <button @click="toast.info('Be at the area 10 minutes before the event time')">Info</button>
    <button @click="toast.warning('Event start time cannot be earlier than 8am')">Warning</button>
    <button @click="toast.error('Event has not been created')">Error</button>
    <button @click="promise">Promise</button>
  </div>
  <ToastRegion :toaster="toast">
    <template #default>
      <Toast>
        <CircleCheckIcon data-show="success" aria-hidden="true" />
        <InfoIcon data-show="info" aria-hidden="true" />
        <TriangleAlertIcon data-show="warning" aria-hidden="true" />
        <OctagonXIcon data-show="error" aria-hidden="true" />
        <LoaderCircleIcon data-show="loading" aria-hidden="true" />
        <ToastTitle />
      </Toast>
    </template>
  </ToastRegion>
</template>
