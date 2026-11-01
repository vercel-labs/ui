<script lang="ts">
  import { Button } from "@ui-sdk/svelte/button"

  const actions = ["Archive", "Report", "Snooze"]
</script>

<div data-slot="row" role="group" aria-label="Message actions">
  {#each actions as action (action)}
    <Button
    >
      {action}
    </Button>
  {/each}
</div>
