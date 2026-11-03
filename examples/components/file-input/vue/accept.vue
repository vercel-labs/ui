<script setup lang="ts">
import { FileIcon, ImageIcon, XIcon } from "@lucide/vue"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
  type FileRejection,
} from "@ui-sdk/vue/file-input"
import { ref } from "vue"

const messages: Record<string, string> = {
  "file-type": "isn't a supported type",
}

const rejected = ref<FileRejection[]>([])
</script>

<template>
  <FileInput
    multiple
    :accept="['image/*', '.pdf']"
    @value-change="rejected = []"
    @reject="(next) => (rejected = next)"
  >
    <FileInputDropzone>
      <ImageIcon aria-hidden="true" />
      <span data-slot="hint">Images and PDFs</span>
      <FileInputTrigger>Browse</FileInputTrigger>
    </FileInputDropzone>
    <FileInputList aria-label="Files">
      <FileInputItem v-slot="{ state }">
        <ImageIcon aria-hidden="true" v-if="state.file.type.startsWith('image/')" />
        <FileIcon aria-hidden="true" v-else />
        <span>{{ state.file.name }}</span>
        <span data-slot="hint">{{ formatFileSize(state.file.size) }}</span>
        <FileInputItemRemove>
          <XIcon aria-hidden="true" />
        </FileInputItemRemove>
      </FileInputItem>
    </FileInputList>
    <div data-slot="output">
      <p v-for="({ file, reasons }, index) in rejected" :key="index">
        {{ file.name }} {{ messages[reasons[0]] ?? "was rejected" }}
      </p>
    </div>
  </FileInput>
</template>
