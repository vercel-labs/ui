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
  type FileInputValueChangeDetails,
} from "@ui-sdk/vue/file-input"
import { ref } from "vue"

const files = ref<File[]>([])
const last = ref("Nothing yet")

function onValueChange(value: File[], details: FileInputValueChangeDetails) {
  files.value = value
  last.value = `${details.reason}: +${details.added.length} -${details.removed.length}`
}
</script>

<template>
  <FileInput multiple :value="files" @value-change="onValueChange">
    <FileInputDropzone>
      <span data-slot="hint"> {{ files.length }} {{ files.length === 1 ? "file" : "files" }} </span>
      <div data-slot="row">
        <FileInputTrigger>Add</FileInputTrigger>
        <button type="button" :disabled="!files.length" @click="files = files.slice(0, -1)">
          Remove last
        </button>
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
    <output data-slot="output">{{ last }}</output>
  </FileInput>
</template>
