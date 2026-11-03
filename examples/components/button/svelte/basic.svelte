<script lang="ts">
  import { Button } from "@ui-sdk/svelte/button"
  let count = $state(0)
</script>

<div data-slot="stack">
  <Button
    onclick={() => count++}
  >Button</Button>
  <output data-slot="output">Pressed {count} {count === 1 ? "time" : "times"}</output>
</div>
