<script lang="ts">
  import { Toggle } from "@ui-sdk/svelte/toggle"
</script>

<div data-slot="row">
  <Toggle disabled>
    Disabled
  </Toggle>
  <Toggle defaultPressed disabled>
    Disabled
  </Toggle>
</div>
