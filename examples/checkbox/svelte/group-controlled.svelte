<script lang="ts">
  import { Check } from "@lucide/svelte"
  import type { ChangeDetails } from "@ui-sdk/core"
  import {
    Checkbox,
    CheckboxGroup,
    CheckboxIndicator,
    createCheckboxGroupController,
  } from "@ui-sdk/svelte/checkbox"

  const days = [
    { value: "mon", label: "Mon" },
    { value: "tue", label: "Tue" },
    { value: "wed", label: "Wed" },
    { value: "thu", label: "Thu" },
    { value: "fri", label: "Fri" },
    { value: "sat", label: "Sat" },
    { value: "sun", label: "Sun" },
  ]

  const weekdays = ["mon", "tue", "wed", "thu", "fri"]

  const schedule = createCheckboxGroupController()

  let value = $state(["mon", "tue"])
  let reason = $state("")

  function onValueChange(_: string[], details: ChangeDetails) {
    reason = details.reason
  }
</script>

<div data-slot="stack">
  <h3 id="controlled-days">Working days</h3>
  <CheckboxGroup
    bind:value
    aria-labelledby="controlled-days"
    controller={schedule}

    {onValueChange}
  >
    {#each days as day (day.value)}
      <label data-slot="label">
        <Checkbox value={day.value}>
          <CheckboxIndicator>
            <Check aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        {day.label}
      </label>
    {/each}
  </CheckboxGroup>
  <div data-slot="row">
    <button type="button" onclick={() => schedule.setValue(weekdays)}>
      Select weekdays
    </button>
    <button type="button" onclick={() => schedule.setValue([])}>
      Clear
    </button>
  </div>

  <output data-slot="output">
    Value: {JSON.stringify(value)}{reason ? `, last change: ${reason}` : ""}
  </output>
</div>
