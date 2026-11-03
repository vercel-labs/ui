<script lang="ts">
  import { CheckIcon, ChevronDownIcon, XIcon } from "@lucide/svelte"
  import {
    Select,
    SelectClear,
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

  let value = $state<string | null>("banana")
</script>

<div data-slot="stack">
  <Select bind:value placeholder="Select a fruit">
    <div data-slot="stack">
      <SelectLabel>Fruit</SelectLabel>
      <div data-slot="row">
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
        <SelectClear aria-label="Clear fruit">
          <XIcon />
        </SelectClear>
      </div>
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
  <output data-slot="output">Value: {JSON.stringify(value)}</output>
</div>
