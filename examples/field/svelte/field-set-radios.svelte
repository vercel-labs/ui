<script lang="ts">
  import { FieldLegend, FieldSet } from "@ui-sdk/svelte/field"
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const plans = [
    { value: "monthly", label: "Monthly", price: "$12 a month" },
    { value: "yearly", label: "Yearly", price: "$120 a year" },
  ]
</script>

<FieldSet>
  <FieldLegend>
    {#snippet render({ props })}
      <div {...props}>Billing period</div>
    {/snippet}
  </FieldLegend>
  <RadioGroup name="period" defaultValue="monthly">
    {#each plans as plan (plan.value)}
      <label data-slot="card">
        <span data-slot="row">
          <Radio value={plan.value}>
            <RadioIndicator />
          </Radio>
          {plan.label}
        </span>
        <span data-slot="hint">{plan.price}</span>
      </label>
    {/each}
  </RadioGroup>
</FieldSet>
