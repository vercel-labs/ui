<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable :step="5" :large-step="25">
    <ResizablePanel :default-size="50" :min-size="10">Left</ResizablePanel>
    <ResizableHandle aria-label="Resize left" />
    <ResizablePanel :default-size="50" :min-size="10">Right</ResizablePanel>
  </Resizable>
</template>
