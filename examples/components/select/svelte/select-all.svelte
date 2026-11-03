<script lang="ts">
  import { CheckIcon, ChevronDownIcon, MinusIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectSelectAll,
    SelectSeparator,
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

<Select multiple defaultValue={["apple", "banana", "grapes"]} placeholder="Select fruits">
  <div data-slot="stack">
    <SelectLabel>Fruits</SelectLabel>
    <SelectTrigger>
      <SelectValue maxLabels={2} getMoreLabel={(count: number) => `${count} more`} />
      <ChevronDownIcon />
    </SelectTrigger>
  </div>
  <SelectContent>
    <SelectSelectAll>
      {#snippet children(state)}
        Select all
        {#if state.checked}<CheckIcon />{/if}
        {#if state.indeterminate}<MinusIcon />{/if}
      {/snippet}
    </SelectSelectAll>
    <SelectSeparator />
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
