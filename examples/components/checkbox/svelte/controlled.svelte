<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import {
    Checkbox,
    CheckboxIndicator,
    createCheckboxController,
    type CheckedState,
  } from "@ui-sdk/svelte/checkbox"

  const updates = createCheckboxController()
  let checked = $state<CheckedState>(false)
  let reason = $state("")

  function onCheckedChange(_: CheckedState, details: { reason: string }) {
    reason = details.reason
  }
</script>

<div data-slot="stack">
  <label data-slot="label">
    <Checkbox
      bind:checked
      controller={updates}

      {onCheckedChange}
    >
      <CheckboxIndicator>
        <CheckIcon aria-hidden="true" />
      </CheckboxIndicator>
    </Checkbox>
    Email me about product updates
  </label>
  <button type="button" onclick={() => updates.toggle()}>
    Toggle from outside
  </button>
  <output data-slot="output">
      Checked: {String(checked)}{reason ? `, last change: ${reason}` : ""}
    </output>
</div>
