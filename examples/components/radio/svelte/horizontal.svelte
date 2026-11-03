<script lang="ts">
  import { Radio, RadioGroup } from "@ui-sdk/svelte/radio"

  const sizes = [
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
  ]
</script>

<div data-slot="stack">
  <span id="size-heading">Size</span>
  <RadioGroup data-variant="segmented" defaultValue="m" aria-labelledby="size-heading">
    {#each sizes as size (size.value)}
      <Radio value={size.value}>
        {size.label}
      </Radio>
    {/each}
  </RadioGroup>
</div>
