<script lang="ts">
  import { ArrowUp } from "@lucide/svelte"
  import { Button } from "@ui-sdk/svelte/button"
</script>

<div data-slot="row">
  <Button data-shape="round"
    >Subscribe</Button
  >
  <Button data-shape="round"
    aria-label="Scroll to top"
  >
    <ArrowUp />
  </Button>
</div>
