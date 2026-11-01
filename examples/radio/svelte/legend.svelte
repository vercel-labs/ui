<script lang="ts">
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const plans = [
    { value: "monthly", label: "Monthly", price: "$9.99/month" },
    { value: "yearly", label: "Yearly", price: "$99.99/year" },
    { value: "lifetime", label: "Lifetime", price: "$299.99" },
  ]

  const id = $props.id()
</script>

<fieldset data-slot="stack">
  <legend
    id={`${id}-subscription-legend`}
  >Subscription plan</legend>
  <p data-slot="hint" id={`${id}-subscription-hint`}>
    Yearly and lifetime plans offer significant savings.
  </p>
  <RadioGroup
    defaultValue="monthly"
    aria-labelledby={`${id}-subscription-legend`}
    aria-describedby={`${id}-subscription-hint`}
  >
    {#each plans as plan (plan.value)}
      <label data-slot="label">
        <Radio value={plan.value}>
          <RadioIndicator />
        </Radio>
        {plan.label} <span data-slot="hint">{plan.price}</span>
      </label>
    {/each}
  </RadioGroup>
</fieldset>
