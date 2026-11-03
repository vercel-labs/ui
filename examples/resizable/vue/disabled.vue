<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
import { ref } from "vue"

const disabled = ref(false)
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <Resizable
      :disabled="disabled"
      class="h-50 w-full rounded-2xl border border-border data-disabled:opacity-50"
    >
      <ResizablePanel class="flex items-center justify-center p-6 text-sm font-medium">Fixed</ResizablePanel>
      <ResizableHandle
        disabled
        aria-label="Resize fixed"
        class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full data-disabled:opacity-50"
      />
      <ResizablePanel class="flex items-center justify-center p-6 text-sm font-medium">Two</ResizablePanel>
      <ResizableHandle
        aria-label="Resize two"
        class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full data-disabled:opacity-50"
      />
      <ResizablePanel class="flex items-center justify-center p-6 text-sm font-medium">Three</ResizablePanel>
    </Resizable>
    <label class="flex w-fit items-center gap-2 text-sm">
      <input v-model="disabled" type="checkbox" class="size-4 accent-primary" />
      Disable the group
    </label>
  </div>
</template>
