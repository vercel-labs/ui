<script setup lang="ts">
import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/vue/file-input"
</script>

<template>
  <FileInput disabled>
    <FileInputDropzone>
      <span data-slot="hint">Uploads are paused</span>
      <FileInputTrigger>Browse</FileInputTrigger>
    </FileInputDropzone>
  </FileInput>
</template>
