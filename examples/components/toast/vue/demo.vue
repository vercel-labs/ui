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

function show() {
  toast("Event has been created", {
    description: "Your event is ready to share.",
    cancel: { label: "Dismiss" },
  })
}
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <button data-variant="secondary" @click="show">Show toast</button>
  <ToastRegion :toaster="toast">
    <template #default="{ toast: item }">
      <Toast>
        <div data-slot="stack">
          <ToastTitle />
          <ToastDescription />
        </div>

        <ToastClose data-variant="secondary" v-if="item.cancel" :action="item.cancel.onCancel">
          {{ item.cancel.label }}
        </ToastClose>
      </Toast>
    </template>
  </ToastRegion>
</template>
