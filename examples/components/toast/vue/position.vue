<script setup lang="ts">
import { onUnmounted } from "vue"
import { Toast, ToastDescription, ToastRegion, ToastTitle, createToaster } from "@ui-sdk/vue/toast"
import { ref } from "vue"

const toast = createToaster()

const placements = [
  { side: "top", align: "start", label: "Top Left" },
  { side: "top", align: "center", label: "Top Center" },
  { side: "top", align: "end", label: "Top Right" },
  { side: "bottom", align: "start", label: "Bottom Left" },
  { side: "bottom", align: "center", label: "Bottom Center" },
  { side: "bottom", align: "end", label: "Bottom Right" },
] as const

const placement = ref<(typeof placements)[number]>(placements[5])

function place(item: (typeof placements)[number]) {
  placement.value = item
  toast("Event has been created", { description: item.label })
}
onUnmounted(() => {
  toast.dismiss()
})
</script>

<template>
  <div data-slot="row">
    <button v-for="item in placements" :key="item.label" @click="place(item)">
      {{ item.label }}
    </button>
  </div>
  <ToastRegion :toaster="toast" :side="placement.side" :align="placement.align">
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
