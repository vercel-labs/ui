<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"

  const days = [
    { value: "mon", label: "Mon" },
    { value: "tue", label: "Tue" },
    { value: "wed", label: "Wed" },
    { value: "thu", label: "Thu" },
    { value: "fri", label: "Fri" },
    { value: "sat", label: "Sat" },
    { value: "sun", label: "Sun" },
  ]
</script>

<div data-slot="stack">
  <h3 id="horizontal-days">Repeat on</h3>
  <CheckboxGroup aria-labelledby="horizontal-days" defaultValue={["mon", "wed", "fri"]}>
    {#each days as day (day.value)}
      <label data-slot="label">
        <Checkbox value={day.value}>
          <CheckboxIndicator>
            <CheckIcon />
          </CheckboxIndicator>
        </Checkbox>
        {day.label}
      </label>
    {/each}
  </CheckboxGroup>
</div>
