<script setup lang="ts">
import { Resizable, ResizableHandle, ResizablePanel, type ResizableStorage } from "@ui-sdk/vue/resizable"

const session: ResizableStorage = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
}
</script>

<template>
  <Resizable auto-save-id="docs-storage" :storage="session">
    <ResizablePanel id="session-files" :default-size="30">Files</ResizablePanel>
    <ResizableHandle aria-label="Resize files" />
    <ResizablePanel id="session-editor">Editor</ResizablePanel>
  </Resizable>
</template>
