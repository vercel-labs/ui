<script lang="ts">
  import { LoaderCircleIcon } from "@lucide/svelte"
  import { Button } from "@ui-sdk/svelte/button"
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
</script>

<Button
  onclick={() => wait(1500)}
  pendingAnnouncement="Saving"
>
  <LoaderCircleIcon data-slot="spinner"
    aria-hidden="true"
  />
  Save
</Button>
