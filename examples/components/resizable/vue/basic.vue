<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable>
    <ResizablePanel :default-size="50">One</ResizablePanel>
    <ResizableHandle aria-label="Resize one"> </ResizableHandle>
    <ResizablePanel :default-size="50">
      <Resizable orientation="vertical">
        <ResizablePanel :default-size="25">Two</ResizablePanel>
        <ResizableHandle aria-label="Resize two"> </ResizableHandle>
        <ResizablePanel :default-size="75">Three</ResizablePanel>
      </Resizable>
    </ResizablePanel>
  </Resizable>
</template>
