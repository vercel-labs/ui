<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable
    class="h-50 w-full max-w-md rounded-2xl border border-border transition-colors data-dragging:bg-muted/50 motion-reduce:transition-none"
  >
    <ResizablePanel
      v-slot="{ state }"
      :default-size="35"
      :min-size="20"
      collapsible
      class="flex flex-col items-center justify-center gap-1 p-6 text-sm font-medium"
    >
      <span>Files</span>
      <span class="text-xs text-muted-foreground tabular-nums">{{
        state.collapsed ? "Collapsed" : `${Math.round(state.size)}%`
      }}</span>
    </ResizablePanel>
    <ResizableHandle aria-label="Resize files">
      <template #render="{ props, state }">
        <div
          v-bind="props"
          :class="
            state.dragging
              ? 'w-1 bg-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/30'
              : state.hovering
                ? 'w-1 bg-ring outline-none focus-visible:ring-3 focus-visible:ring-ring/30'
                : 'w-1 bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30'
          "
        />
      </template>
    </ResizableHandle>
    <ResizablePanel v-slot="{ state }" class="flex items-center justify-center p-6 text-sm font-medium"
      >Editor, {{ state.orientation }}</ResizablePanel
    >
  </Resizable>
</template>
