<script lang="ts">
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const plans = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]

  const id = $props.id()
</script>

<div data-slot="stack">
  <div data-slot="stack">
    <span
      id={`${id}-current-plan`}
    >Your plan</span>
    <p data-slot="hint"
      id={`${id}-current-plan-hint`}
    >Ask an admin to change plans.</p>
  </div>
  <RadioGroup
    defaultValue="pro"
    readOnly
    aria-labelledby={`${id}-current-plan`}
    aria-describedby={`${id}-current-plan-hint`}
  >
    {#each plans as plan (plan.value)}
      <label data-slot="label">
        <Radio value={plan.value}>
          <RadioIndicator />
        </Radio>
        {plan.label}
      </label>
    {/each}
  </RadioGroup>
</div>
