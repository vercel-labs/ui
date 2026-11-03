<script setup lang="ts">
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/vue/progress"
import { ref } from "vue"

const value = ref(20)
</script>

<template>
  <div data-slot="stack">
    <Progress :value="value">
      <ProgressLabel>Uploading files</ProgressLabel>
      <ProgressValue />
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
    <div data-slot="row">
      <button
        data-variant="secondary"
        type="button"
        :aria-disabled="value >= 100"
        @click="value = Math.min(100, value + 20)"
      >
        Upload more
      </button>
      <button data-variant="secondary" type="button" @click="value = 0">Reset</button>
    </div>
  </div>
</template>
