<script setup lang="ts">
import { onUnmounted } from "vue"
import {
  Toast,
  ToastAction,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/vue/toast"

const toast = createToaster()

function create() {
  toast("Invoice created", {
    description: "INV-1042",
    action: { label: "View", href: "#invoice-1042" },
  })
}
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <button @click="create">Create invoice</button>
  <p data-slot="hint" id="invoice-1042">Invoice INV-1042 · $240 · Draft</p>
  <ToastRegion :toaster="toast">
    <template #default="{ toast: item }">
      <Toast>
        <div data-slot="stack">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
      </Toast>
    </template>
  </ToastRegion>
</template>
