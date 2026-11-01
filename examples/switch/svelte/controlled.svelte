<script lang="ts">
  import { createSwitchController, Switch, SwitchThumb } from "@ui-sdk/svelte/switch"

  const wifi = createSwitchController()
  let checked = $state(true)
  let reason = $state("")

  function onCheckedChange(_checked: boolean, details: { reason: string }) {
    reason = details.reason
  }
</script>

<div data-slot="stack">
  <label data-slot="label">
    <Switch bind:checked controller={wifi} {onCheckedChange}>
      <SwitchThumb />
    </Switch>
    Wi-Fi
  </label>
  <button type="button" onclick={() => wifi.toggle()}>
    Toggle from outside
  </button>
  <output data-slot="output">
    Wi-Fi: {checked ? "on" : "off"}{reason ? `, last change: ${reason}` : ""}
  </output>
</div>
