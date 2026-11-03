<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable>
    <ResizablePanel :default-size="25">Sidebar</ResizablePanel>
    <ResizableHandle aria-label="Resize sidebar">
      <div />
    </ResizableHandle>
    <ResizablePanel :default-size="75">Content</ResizablePanel>
  </Resizable>
</template>
