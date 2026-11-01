<script lang="ts">
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const options = [
    { value: "default", label: "Default" },
    { value: "comfortable", label: "Comfortable" },
    { value: "compact", label: "Compact" },
  ]
</script>

<RadioGroup defaultValue="comfortable" aria-label="Density">
  {#each options as option (option.value)}
    <label data-slot="label">
      <Radio value={option.value}>
        <RadioIndicator />
      </Radio>
      {option.label}
    </label>
  {/each}
</RadioGroup>
