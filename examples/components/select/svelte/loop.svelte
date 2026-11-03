<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"

  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ]

</script>

<Select loop={false} defaultValue="pineapple">
  <div data-slot="stack">
    <SelectLabel>Fruit</SelectLabel>
    <SelectTrigger>
      <SelectValue />
      <ChevronDownIcon />
    </SelectTrigger>
    <p data-slot="hint">Open it and press ArrowDown.</p>
  </div>
  <SelectContent>
    {#each fruits as fruit (fruit.value)}
      <SelectItem value={fruit.value}>
        {fruit.label}
        <SelectItemIndicator>
          <CheckIcon />
        </SelectItemIndicator>
      </SelectItem>
    {/each}
  </SelectContent>
</Select>
