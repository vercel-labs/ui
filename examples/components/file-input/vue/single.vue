<script setup lang="ts">
import { FileIcon } from "@lucide/vue"
import { FileInput, FileInputDropzone, FileInputTrigger, formatFileSize } from "@ui-sdk/vue/file-input"
</script>

<template>
  <FileInput v-slot="{ state }" accept=".pdf">
    <FileInputDropzone>
      <FileIcon aria-hidden="true" />
      <span data-slot="hint">
        {{
          state.value[0] ? `${state.value[0].name}, ${formatFileSize(state.value[0].size)}` : "Drop one PDF"
        }}
      </span>
      <FileInputTrigger>{{ state.value[0] ? "Replace" : "Choose" }}</FileInputTrigger>
    </FileInputDropzone>
  </FileInput>
</template>
