<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable orientation="vertical">
    <ResizablePanel :default-size="25">Header</ResizablePanel>
    <ResizableHandle aria-label="Resize header" />
    <ResizablePanel :default-size="75">Content</ResizablePanel>
  </Resizable>
</template>
