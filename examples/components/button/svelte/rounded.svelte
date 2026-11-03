<script lang="ts">
  import { ArrowUpIcon } from "@lucide/svelte"
  import { Button } from "@ui-sdk/svelte/button"
</script>

<div data-slot="row">
  <Button data-shape="round"
    >Subscribe</Button
  >
  <Button data-shape="round"
    aria-label="Scroll to top"
  >
    <ArrowUpIcon />
  </Button>
</div>
