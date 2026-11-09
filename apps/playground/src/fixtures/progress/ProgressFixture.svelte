<script lang="ts">
  import {
    Progress,
    ProgressIndicator,
    ProgressLabel,
    ProgressTrack,
    ProgressValue,
  } from "@ui-sdk/svelte"
  import { progressFixture } from "tests/fixtures/progress.ts"

  const { upload, loading, files, disk } = progressFixture
  let value = $state(upload.value)
  const bars = [
    { label: loading.label, value: null },
    {
      label: files.label,
      value: files.value,
      max: files.max,
      getValueLabel: (value: number | null) => files.valueLabel(value!),
    },
    {
      label: disk.label,
      value: disk.value,
      max: disk.max,
      format: disk.format,
    },
  ]
</script>

<div class="fixture">
  <button>Before</button>
  <Progress class="gauge" {value}>
    <ProgressLabel>{upload.label}</ProgressLabel>
    <ProgressValue class="gauge-value" />
    <ProgressTrack class="gauge-track"
      ><ProgressIndicator class="gauge-indicator" /></ProgressTrack
    >
  </Progress>
  {#each bars as { label, ...bar } (label)}
    <Progress class="gauge" {...bar}>
      <ProgressLabel>{label}</ProgressLabel>
      <ProgressValue class="gauge-value" />
      <ProgressTrack class="gauge-track"
        ><ProgressIndicator class="gauge-indicator" /></ProgressTrack
      >
    </Progress>
  {/each}
  <button onclick={() => (value = Math.min(100, value + upload.step))}
    >Advance</button
  >
  <button onclick={() => (value = upload.value)}>Restart</button>
  <button>After</button>
  <output role="status" aria-label="Last action"></output>
</div>
