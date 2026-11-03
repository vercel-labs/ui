<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable>
    <ResizablePanel default-size="200px" min-size="160px" max-size="320px">Navigation</ResizablePanel>
    <ResizableHandle aria-label="Resize navigation">
      <div />
    </ResizableHandle>
    <ResizablePanel :min-size="30">Content</ResizablePanel>
  </Resizable>
</template>
