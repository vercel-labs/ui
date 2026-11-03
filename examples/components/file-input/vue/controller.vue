<script setup lang="ts">
import { FileIcon, XIcon } from "@lucide/vue"
import {
  createFileInputController,
  FileInput,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  formatFileSize,
} from "@ui-sdk/vue/file-input"

const controller = createFileInputController()

function addNote() {
  controller.addFiles([new File(["hello"], `note-${Date.now()}.txt`, { type: "text/plain" })])
}
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <button type="button" @click="controller.open()">Open the picker</button>
      <button type="button" @click="addNote">Add a note</button>
      <button type="button" @click="controller.clear()">Clear</button>
    </div>
    <FileInput multiple :controller="controller">
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
  </div>
</template>
