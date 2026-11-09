<script setup lang="ts">
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@ui-sdk/vue"
import { meterFixture } from "tests/fixtures/meter.ts"
import { ref } from "vue"

const { storage, requests, disk, score } = meterFixture
const value = ref(storage.value)
const meters = [
  {
    label: requests.label,
    value: requests.value,
    max: requests.max,
    getValueLabel: requests.valueLabel,
  },
  { label: disk.label, value: disk.value, max: disk.max, format: disk.format },
  { label: score.label, value: score.value, min: score.min, max: score.max },
]
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Meter class="gauge" :value="value">
      <MeterLabel>{{ storage.label }}</MeterLabel>
      <MeterValue class="gauge-value" />
      <MeterTrack class="gauge-track"
        ><MeterIndicator class="gauge-indicator"
      /></MeterTrack>
    </Meter>
    <Meter
      v-for="{ label, ...meter } in meters"
      :key="label"
      class="gauge"
      v-bind="meter"
    >
      <MeterLabel>{{ label }}</MeterLabel>
      <MeterValue class="gauge-value" />
      <MeterTrack class="gauge-track"
        ><MeterIndicator class="gauge-indicator"
      /></MeterTrack>
    </Meter>
    <button @click="value += storage.step">Fill</button>
    <button @click="value = storage.value">Reset</button>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
  </div>
</template>
