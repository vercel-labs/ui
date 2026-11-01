<script lang="ts">
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const plans = [
    { value: "plus", label: "Plus", description: "For individuals and small teams." },
    { value: "pro", label: "Pro", description: "For growing businesses." },
    { value: "enterprise", label: "Enterprise", description: "For large teams and enterprises." },
  ]
</script>

<RadioGroup defaultValue="plus" aria-label="Plan">
  {#each plans as plan (plan.value)}
    <label data-slot="card">
      <span data-slot="stack">
        <span>{plan.label}</span>
        <span data-slot="hint">{plan.description}</span>
      </span>
      <Radio value={plan.value}>
        <RadioIndicator />
      </Radio>
    </label>
  {/each}
</RadioGroup>
