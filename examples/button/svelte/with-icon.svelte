<script lang="ts">
  import { ChevronRight, Plus } from "@lucide/svelte"
  import { Button } from "@ui-sdk/svelte/button"
</script>

<div data-slot="row">
  <Button
  >
    <Plus />
    New project
  </Button>
  <Button
  >
    Continue
    <ChevronRight />
  </Button>
</div>
