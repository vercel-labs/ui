<script lang="ts">
  import {
    Progress,
    ProgressIndicator,
    ProgressLabel,
    ProgressTrack,
    ProgressValue,
  } from "@ui-sdk/svelte/progress"

  let value = $state(20)
</script>

<div data-slot="stack">
  <Progress {value}>
    <ProgressLabel>Uploading files</ProgressLabel>
    <ProgressValue />
    <ProgressTrack>
      <ProgressIndicator />
    </ProgressTrack>
  </Progress>
  <div data-slot="row">
    <button data-variant="secondary"
      type="button"
      aria-disabled={value >= 100}
      onclick={() => (value = Math.min(100, value + 20))}
    >
      Upload more
    </button>
    <button data-variant="secondary" type="button" onclick={() => (value = 0)}>
      Reset
    </button>
  </div>
</div>
