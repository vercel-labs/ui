<script setup lang="ts">
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/vue"
import { progressFixture } from "tests/fixtures/progress.ts"
import { ref } from "vue"

const { upload, loading, files, disk } = progressFixture
const value = ref(upload.value)
const bars = [
  { label: loading.label, value: null },
  {
    label: files.label,
    value: files.value,
    max: files.max,
    getValueLabel: (value: number | null) => files.valueLabel(value!),
  },
  { label: disk.label, value: disk.value, max: disk.max, format: disk.format },
]
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Progress class="gauge" :value="value">
      <ProgressLabel>{{ upload.label }}</ProgressLabel>
      <ProgressValue class="gauge-value" />
      <ProgressTrack class="gauge-track"
        ><ProgressIndicator class="gauge-indicator"
      /></ProgressTrack>
    </Progress>
    <Progress
      v-for="{ label, ...bar } in bars"
      :key="label"
      class="gauge"
      v-bind="bar"
    >
      <ProgressLabel>{{ label }}</ProgressLabel>
      <ProgressValue class="gauge-value" />
      <ProgressTrack class="gauge-track"
        ><ProgressIndicator class="gauge-indicator"
      /></ProgressTrack>
    </Progress>
    <button @click="value = Math.min(100, value + upload.step)">Advance</button>
    <button @click="value = upload.value">Restart</button>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
  </div>
</template>
