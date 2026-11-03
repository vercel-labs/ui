<script setup lang="ts">
import { FolderIcon, SearchIcon } from "@lucide/vue"
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/vue/resizable"
</script>

<template>
  <Resizable>
    <ResizablePanel :default-size="30" :min-size="25" collapsible collapsed-size="56px">
      <span data-slot="row">
        <FolderIcon />
        <span>Files</span>
      </span>
      <span data-slot="row">
        <SearchIcon />
        <span>Search</span>
      </span>
    </ResizablePanel>
    <ResizableHandle aria-label="Resize sidebar">
      <div />
    </ResizableHandle>
    <ResizablePanel>Editor</ResizablePanel>
  </Resizable>
</template>
