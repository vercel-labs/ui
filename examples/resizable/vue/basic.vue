<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable class="h-50 w-full max-w-md rounded-2xl border border-border">
    <ResizablePanel :default-size="50" class="flex items-center justify-center p-6 text-sm font-medium"
      >One</ResizablePanel
    >
    <ResizableHandle
      aria-label="Resize one"
      class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"
    >
    </ResizableHandle>
    <ResizablePanel :default-size="50">
      <Resizable orientation="vertical" class="h-full">
        <ResizablePanel :default-size="25" class="flex items-center justify-center p-6 text-sm font-medium"
          >Two</ResizablePanel
        >
        <ResizableHandle
          aria-label="Resize two"
          class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"
        >
        </ResizableHandle>
        <ResizablePanel :default-size="75" class="flex items-center justify-center p-6 text-sm font-medium"
          >Three</ResizablePanel
        >
      </Resizable>
    </ResizablePanel>
  </Resizable>
</template>
