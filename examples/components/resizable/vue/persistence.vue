<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable auto-save-id="docs-persistence">
    <ResizablePanel id="docs-sidebar" :default-size="30" :min-size="20">Sidebar</ResizablePanel>
    <ResizableHandle aria-label="Resize sidebar">
      <div />
    </ResizableHandle>
    <ResizablePanel id="docs-content">Content</ResizablePanel>
  </Resizable>
</template>
