<script setup lang="ts">
import { FileIcon, XIcon } from "@lucide/vue"
import {
  createFileInputController,
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
  duplicate: "is already added",
}

const controller = createFileInputController()
const rejected = ref<FileRejection[]>([])

function validate(file: File) {
  return controller.getValue().some((other) => other.name === file.name) ? "duplicate" : null
}
</script>

<template>
  <FileInput
    multiple
    :controller="controller"
    :validate="validate"
    @value-change="rejected = []"
    @reject="(next) => (rejected = next)"
  >
    <FileInputDropzone>
      <span data-slot="hint">Each name once</span>
      <FileInputTrigger>Add files</FileInputTrigger>
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
    <div data-slot="output">
      <p v-for="({ file, reasons }, index) in rejected" :key="index">
        {{ file.name }} {{ messages[reasons[0]] ?? "was rejected" }}
      </p>
    </div>
  </FileInput>
</template>
