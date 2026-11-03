<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable>
    <ResizablePanel v-slot="{ state }" :default-size="35" :min-size="20" collapsible>
      <span>Files</span>
      <span data-slot="hint">{{ state.collapsed ? "Collapsed" : `${Math.round(state.size)}%` }}</span>
    </ResizablePanel>
    <ResizableHandle aria-label="Resize files">
      <template #render="{ props }">
        <div v-bind="props" />
      </template>
    </ResizableHandle>
    <ResizablePanel v-slot="{ state }">Editor, {{ state.orientation }}</ResizablePanel>
  </Resizable>
</template>
