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
  <div class="flex flex-wrap items-center gap-4">
    <button
      class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50"
      @click="add"
    >
      Add toast
    </button>
    <label class="flex items-center gap-2 text-sm">
      <input v-model="expanded" type="checkbox" class="size-4 accent-primary" />
      Always expanded
    </label>
  </div>
  <ToastRegion
    :toaster="toast"
    :max-visible="4"
    :expanded="expanded"
    class="m-4 w-[356px] max-w-[calc(100vw-2rem)] h-(--toast-front-height) outline-none [--dir:-1] data-[side=top]:[--dir:1] data-expanded:h-[calc(var(--toast-stack-height)+(var(--toast-count)-1)*0.75rem)]"
  >
    <template #default="{ toast: item }">
      <Toast
        class="absolute inset-x-0 z-[calc(100-var(--toast-index))] flex items-center gap-3 overflow-hidden rounded-2xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[translate,scale,opacity,height,box-shadow] duration-300 in-data-[side=bottom]:bottom-0 in-data-[side=top]:top-0 [--y:calc(var(--dir)*var(--toast-index)*0.75rem)] [translate:var(--toast-swipe-x,0px)_calc(var(--y)+var(--toast-swipe-y,0px))] scale-[calc(1-var(--toast-index)*0.05)] not-data-front:not-data-expanded:h-(--toast-front-height) focus-visible:ring-3 focus-visible:ring-ring/30 data-expanded:scale-100 data-expanded:[--y:calc(var(--dir)*(var(--toast-offset)+var(--toast-index)*0.75rem))] data-starting-style:opacity-0 data-starting-style:[--y:calc(var(--dir)*-100%)] data-ending-style:opacity-0 data-swiping:transition-none motion-reduce:transition-none dark:ring-foreground/10"
      >
        <div class="grid flex-1 gap-1">
          <ToastTitle class="font-medium" />
          <ToastDescription class="text-muted-foreground" />
        </div>
      </Toast>
    </template>
  </ToastRegion>
</template>
