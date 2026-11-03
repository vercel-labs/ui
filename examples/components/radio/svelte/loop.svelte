<script lang="ts">
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]
</script>

<RadioGroup defaultValue="low" loop={false} aria-label="Priority">
  {#each priorities as priority (priority.value)}
    <label data-slot="label">
      <Radio value={priority.value}>
        <RadioIndicator />
      </Radio>
      {priority.label}
    </label>
  {/each}
</RadioGroup>
