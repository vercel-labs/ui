<script setup lang="ts">
import { SmartphoneIcon } from "@lucide/vue"
import { FileInput, FileInputTrigger } from "@ui-sdk/vue/file-input"
</script>

<template>
  <FileInput v-slot="{ state }" accept="image/*" capture="environment">
    <FileInputTrigger>
      <SmartphoneIcon aria-hidden="true" />
      Take a photo
    </FileInputTrigger>
    <span data-slot="hint">{{ state.value[0]?.name ?? "No photo yet" }}</span>
  </FileInput>
</template>
