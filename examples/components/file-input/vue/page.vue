<script setup lang="ts">
import { FileIcon, UploadIcon, XIcon } from "@lucide/vue"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  formatFileSize,
} from "@ui-sdk/vue/file-input"
</script>

<template>
  <FileInput multiple>
    <p data-slot="hint">Drag a file anywhere over this page.</p>
    <FileInputDropzone target="document" data-variant="overlay">
      <div data-slot="stack">
        <UploadIcon aria-hidden="true" />
        <p>Drop to attach</p>
      </div>
    </FileInputDropzone>
    <FileInputList aria-label="Files">
      <FileInputItem v-slot="{ state }">
        <FileIcon aria-hidden="true" />
        <span>{{ state.file.name }}</span>
        <span data-slot="hint">{{ formatFileSize(state.file.size) }}</span>
        <FileInputItemRemove>
          <XIcon aria-hidden="true" />
        </FileInputItemRemove>
      </FileInputItem>
    </FileInputList>
  </FileInput>
</template>
