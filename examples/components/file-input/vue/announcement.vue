<script setup lang="ts">
import { ImageIcon, XIcon } from "@lucide/vue"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
  type FileInputChange,
} from "@ui-sdk/vue/file-input"

function announcement({ added, removed, rejected }: FileInputChange) {
  return (
    [
      added.length && `Added ${added.map((file) => file.name).join(", ")}.`,
      removed.length && `Removed ${removed.map((file) => file.name).join(", ")}.`,
      rejected.length && `${rejected.length} skipped, images only.`,
    ]
      .filter(Boolean)
      .join(" ") || null
  )
}
</script>

<template>
  <FileInput multiple accept="image/*" :announcement="announcement">
    <FileInputDropzone>
      <span data-slot="hint">Images, announced by name</span>
      <FileInputTrigger>Add images</FileInputTrigger>
    </FileInputDropzone>
    <FileInputList aria-label="Images">
      <FileInputItem v-slot="{ state }">
        <ImageIcon aria-hidden="true" />
        <span>{{ state.file.name }}</span>
        <span data-slot="hint">{{ formatFileSize(state.file.size) }}</span>
        <FileInputItemRemove>
          <XIcon aria-hidden="true" />
        </FileInputItemRemove>
      </FileInputItem>
    </FileInputList>
  </FileInput>
</template>
