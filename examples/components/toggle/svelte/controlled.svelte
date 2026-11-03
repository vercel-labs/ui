<script lang="ts">
  import { BellIcon } from "@lucide/svelte"
  import type { TogglePressedChangeReason } from "@ui-sdk/svelte/toggle"
  import { createToggleController, Toggle, ToggleIcon } from "@ui-sdk/svelte/toggle"

  const notifications = createToggleController()
  let pressed = $state(true)
  let reason = $state("")

  function onPressedChange(_pressed: boolean, details: { reason: TogglePressedChangeReason }) {
    reason = details.reason
  }
</script>

<div data-slot="stack">
  <Toggle bind:pressed controller={notifications} {onPressedChange}>
    <ToggleIcon data-variant="fill">
      <BellIcon />
    </ToggleIcon>
    Notifications
  </Toggle>
  <button type="button" onclick={() => notifications.toggle()}>
    Toggle from outside
  </button>
  <output data-slot="output">
    Notifications: {pressed ? "on" : "off"}{reason && `, last change: ${reason}`}
  </output>
</div>
