<script lang="ts">
  import { ChevronRightIcon, PlusIcon } from "@lucide/svelte"
  import { Button } from "@ui-sdk/svelte/button"
</script>

<div data-slot="row">
  <Button
  >
    <PlusIcon />
    New project
  </Button>
  <Button
  >
    Continue
    <ChevronRightIcon />
  </Button>
</div>
