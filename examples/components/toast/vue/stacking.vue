<script setup lang="ts">
import { onUnmounted } from "vue"
import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/vue/toast"
import { ref } from "vue"

const toast = createToaster()
let count = 0

const expanded = ref(false)

function add() {
  toast(`Notification ${++count}`, { description: "Stacked with the others" })
}
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <div data-slot="row">
    <button @click="add">Add toast</button>
    <label data-slot="label">
      <input v-model="expanded" type="checkbox" />
      Always expanded
    </label>
  </div>
  <ToastRegion :toaster="toast" :max-visible="4" :expanded="expanded">
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
