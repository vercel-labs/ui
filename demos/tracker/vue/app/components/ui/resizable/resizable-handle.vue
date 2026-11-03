<script setup lang="ts">
import { ResizableHandle } from "@ui-sdk/vue/resizable"
import { cn } from "cn"

const props = defineProps<{ class?: string }>()
</script>

<template>
  <ResizableHandle
    :class="
      cn(
        'relative flex w-px items-center justify-center bg-border outline-none after:absolute after:inset-y-0 after:-inset-x-1 focus-visible:ring-3 focus-visible:ring-ring/30 data-dragging:bg-ring data-hovering:bg-ring',
        props.class,
      )
    "
  >
    <div class="z-10 h-6 w-1 shrink-0 rounded-lg bg-border"></div>
  </ResizableHandle>
</template>
