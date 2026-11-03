<script setup lang="ts">
import { FileIcon, XIcon } from "@lucide/vue"
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
  "file-too-large": "is too large",
  "file-too-small": "is empty",
  "too-many-files": "is one file too many",
}

const rejected = ref<FileRejection[]>([])
</script>

<template>
  <FileInput
    v-slot="{ state }"
    multiple
    :max-files="3"
    :max-size="5_000_000"
    :min-size="1"
    @value-change="rejected = []"
    @reject="(next) => (rejected = next)"
  >
    <FileInputDropzone>
      <span data-slot="hint"> {{ state.value.length }} of 3 files, up to 5 MB each </span>
      <FileInputTrigger>Add files</FileInputTrigger>
    </FileInputDropzone>
    <FileInputList aria-label="Files">
      <FileInputItem v-slot="{ state: item }">
        <FileIcon aria-hidden="true" />
        <span>{{ item.file.name }}</span>
        <span data-slot="hint">{{ formatFileSize(item.file.size) }}</span>
        <FileInputItemRemove>
          <XIcon aria-hidden="true" />
        </FileInputItemRemove>
      </FileInputItem>
    </FileInputList>
    <div data-slot="output">
      <p v-for="({ file, reasons }, index) in rejected" :key="index">
        {{ file.name }} {{ reasons.map((reason) => messages[reason] ?? reason).join(" and ") }}
      </p>
    </div>
  </FileInput>
</template>
