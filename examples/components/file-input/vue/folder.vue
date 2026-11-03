<script setup lang="ts">
import { FolderIcon } from "@lucide/vue"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputList,
  FileInputTrigger,
  relativePath,
} from "@ui-sdk/vue/file-input"
</script>

<template>
  <FileInput directory>
    <FileInputDropzone>
      <FolderIcon aria-hidden="true" />
      <span data-slot="hint">Drop a folder</span>
      <FileInputTrigger>Choose a folder</FileInputTrigger>
    </FileInputDropzone>
    <FileInputList aria-label="Files">
      <FileInputItem v-slot="{ state }">
        {{ relativePath(state.file) }}
      </FileInputItem>
    </FileInputList>
  </FileInput>
</template>
