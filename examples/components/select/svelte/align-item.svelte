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

  let aligned = $state(true)
</script>

<div data-slot="stack">
  <Select defaultValue="blueberry">
    <div data-slot="stack">
      <SelectLabel>Fruit</SelectLabel>
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
    </div>
    <SelectContent alignItemWithTrigger={aligned}>
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
  <label data-slot="label">
    <input bind:checked={aligned} type="checkbox" />
    Align item with trigger
  </label>
</div>
