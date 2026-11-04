<script setup lang="ts">
import { onUnmounted } from "vue"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/vue/toast"
import { ref } from "vue"

const toast = createToaster()

const status = ref("")

function archive() {
  toast("Message archived", {
    action: { label: "Undo", onAction: () => (status.value = "Restored"), dismiss: true },
    cancel: { label: "Dismiss", onCancel: () => (status.value = "Kept archived") },
    onDismiss: ({ reason }) => reason === "timeout" && (status.value = "Timed out"),
  })
}
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <button @click="archive">Archive message</button>
  <output data-slot="output">{{ status }}</output>
  <ToastRegion :toaster="toast">
    <template #default="{ toast: item }">
      <Toast>
        <div data-slot="stack">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose v-if="item.cancel" :action="item.cancel.onCancel">
          {{ item.cancel.label }}
        </ToastClose>
      </Toast>
    </template>
  </ToastRegion>
</template>
