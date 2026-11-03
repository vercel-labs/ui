<script setup lang="ts">
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
  type MeterLabelDetails,
} from "@ui-sdk/vue/meter"

const valueLabel = (value: number, details: MeterLabelDetails) =>
  `${value} of ${details.max} requests, ${details.formatted}`
</script>

<template>
  <Meter :value="750" :max="1000" :get-value-label="valueLabel">
    <MeterLabel>API requests</MeterLabel>
    <MeterValue>750 / 1,000</MeterValue>
    <MeterTrack>
      <MeterIndicator />
    </MeterTrack>
  </Meter>
</template>
