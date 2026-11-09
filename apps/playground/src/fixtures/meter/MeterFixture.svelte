<script lang="ts">
  import {
    Meter,
    MeterIndicator,
    MeterLabel,
    MeterTrack,
    MeterValue,
  } from "@ui-sdk/svelte"
  import { meterFixture } from "tests/fixtures/meter.ts"

  const { storage, requests, disk, score } = meterFixture
  let value = $state(storage.value)
  const meters = [
    {
      label: requests.label,
      value: requests.value,
      max: requests.max,
      getValueLabel: requests.valueLabel,
    },
    {
      label: disk.label,
      value: disk.value,
      max: disk.max,
      format: disk.format,
    },
    { label: score.label, value: score.value, min: score.min, max: score.max },
  ]
</script>

<div class="fixture">
  <button>Before</button>
  <Meter class="gauge" {value}>
    <MeterLabel>{storage.label}</MeterLabel>
    <MeterValue class="gauge-value" />
    <MeterTrack class="gauge-track"
      ><MeterIndicator class="gauge-indicator" /></MeterTrack
    >
  </Meter>
  {#each meters as { label, ...meter } (label)}
    <Meter class="gauge" {...meter}>
      <MeterLabel>{label}</MeterLabel>
      <MeterValue class="gauge-value" />
      <MeterTrack class="gauge-track"
        ><MeterIndicator class="gauge-indicator" /></MeterTrack
      >
    </Meter>
  {/each}
  <button onclick={() => (value += storage.step)}>Fill</button>
  <button onclick={() => (value = storage.value)}>Reset</button>
  <button>After</button>
  <output role="status" aria-label="Last action"></output>
</div>
