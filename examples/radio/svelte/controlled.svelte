<script lang="ts">
  import { createRadioGroupController, Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const plans = [
    { value: "starter", label: "Starter" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]

  const planGroup = createRadioGroupController()
  let value = $state<string | null>("pro")
  let reason = $state("")

  function onValueChange(_: string | null, details: { reason: string }) {
    reason = details.reason
  }
</script>

<div data-slot="stack">
  <RadioGroup bind:value aria-label="Plan" controller={planGroup} {onValueChange}>
    {#each plans as plan (plan.value)}
      <label data-slot="label">
        <Radio value={plan.value}>
          <RadioIndicator />
        </Radio>
        {plan.label}
      </label>
    {/each}
  </RadioGroup>
  <button type="button" onclick={() => planGroup.setValue("team")}>
    Choose Team
  </button>
  <div data-slot="stack">
    <output data-slot="output">
      Value: {value ?? "none"}{reason ? `, last change: ${reason}` : ""}
    </output>
  </div>
</div>
