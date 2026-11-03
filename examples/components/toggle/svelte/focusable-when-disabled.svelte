<script lang="ts">
  import { PinIcon } from "@lucide/svelte"
  import { Toggle, ToggleIcon } from "@ui-sdk/svelte/toggle"

  const hint = $props.id()
</script>

<div data-slot="stack">
  <Toggle disabled focusableWhenDisabled aria-describedby={hint}>
    <ToggleIcon>
      <PinIcon />
    </ToggleIcon>
    Pin to top
  </Toggle>
  <p id={hint} data-slot="hint">Only owners can pin messages.</p>
</div>
