<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable :default-layout="[30, 70]">
    <ResizablePanel>Files</ResizablePanel>
    <ResizableHandle aria-label="Resize files" />
    <ResizablePanel>Editor</ResizablePanel>
  </Resizable>
</template>
