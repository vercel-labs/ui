<script setup lang="ts">
import type { ResizableLayoutCommitDetails } from "@ui-sdk/vue/resizable"
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
import { ref } from "vue"

const moves = ref(0)
const saved = ref("nothing yet")

function save(layout: number[], details: ResizableLayoutCommitDetails) {
  saved.value = `${layout.map(Math.round).join(" / ")} after ${details.reason}`
}
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <Resizable
      @layout-change="moves++"
      @layout-commit="save"
      class="h-50 w-full rounded-2xl border border-border"
    >
      <ResizablePanel :default-size="40" class="flex items-center justify-center p-6 text-sm font-medium"
        >Files</ResizablePanel
      >
      <ResizableHandle
        aria-label="Resize files"
        class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"
      />
      <ResizablePanel class="flex items-center justify-center p-6 text-sm font-medium">Editor</ResizablePanel>
    </Resizable>
    <output class="text-sm text-muted-foreground tabular-nums">{{ moves }} changes, saved {{ saved }}</output>
  </div>
</template>
