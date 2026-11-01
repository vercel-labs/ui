<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const plans = [
    { value: "monthly", label: "Monthly ($9.99/month)" },
    { value: "yearly", label: "Yearly ($99.99/year)" },
    { value: "lifetime", label: "Lifetime ($299.99)" },
  ]
</script>

<Field>
  <FieldLabel>Subscription plan</FieldLabel>
  <FieldDescription>
    Yearly and lifetime plans offer significant savings.
  </FieldDescription>
  <RadioGroup name="plan" defaultValue="monthly">
    {#each plans as plan (plan.value)}
      <label data-slot="label">
        <Radio value={plan.value}>
          <RadioIndicator />
        </Radio>
        {plan.label}
      </label>
    {/each}
  </RadioGroup>
</Field>
