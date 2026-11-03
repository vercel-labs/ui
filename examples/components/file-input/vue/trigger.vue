<script setup lang="ts">
import { UploadIcon } from "@lucide/vue"
import { FileInput, FileInputTrigger } from "@ui-sdk/vue/file-input"
</script>

<template>
  <FileInput v-slot="{ state }">
    <FileInputTrigger>
      <UploadIcon aria-hidden="true" />
      Upload a file
    </FileInputTrigger>
    <span data-slot="hint">{{ state.value[0]?.name ?? "No file chosen" }}</span>
  </FileInput>
</template>
