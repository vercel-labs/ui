<script lang="ts">
  import { Toggle, ToggleGroup } from "@ui-sdk/svelte/toggle"
</script>

<ToggleGroup defaultValue={["all"]} aria-label="Calls">
  <Toggle value="all" data-variant="outline">
    All
  </Toggle>
  <Toggle value="missed" data-variant="outline">
    Missed
  </Toggle>
</ToggleGroup>
