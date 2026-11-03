<script lang="ts">
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const options = [
    { value: "default", label: "افتراضي" },
    { value: "comfortable", label: "مريح" },
    { value: "compact", label: "مضغوط" },
  ]
</script>

<div dir="rtl">
  <RadioGroup defaultValue="comfortable" aria-label="الكثافة">
    {#each options as option (option.value)}
      <label data-slot="label">
        <Radio value={option.value}>
          <RadioIndicator />
        </Radio>
        {option.label}
      </label>
    {/each}
  </RadioGroup>
</div>
