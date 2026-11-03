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
import { XIcon } from "@lucide/vue"

const toast = createToaster()

function message() {
  toast({
    title: "Ada Lovelace",
    description: "Can you look at the draft?",
    data: { initials: "AL" },
    action: { label: "Reply", onAction: () => toast("Reply opened") },
  })
}
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <button data-variant="secondary" @click="message">New message</button>
  <ToastRegion :toaster="toast" aria-label="Messages">
    <template #default="{ toast: item }">
      <Toast>
        <span data-slot="media">
          {{ (item.data as { initials: string }).initials }}
        </span>
        <div data-slot="stack">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction data-variant="secondary" />
        <ToastClose data-variant="secondary" aria-label="Close">
          <XIcon aria-hidden="true" />
        </ToastClose>
      </Toast>
    </template>
  </ToastRegion>
</template>
