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

  let value = $state<string[]>(["apple", "grapes"])
</script>

<div data-slot="stack">
  <Select bind:value multiple placeholder="Select fruits">
    <div data-slot="stack">
      <SelectLabel>Fruits</SelectLabel>
      <SelectTrigger>
        <SelectValue>
          {#snippet children(state)}
            {state.placeholder
              ? "Select fruits"
              : state.labels.length > 2
                ? `${state.labels[0]} and ${state.labels.length - 1} more`
                : state.label}
          {/snippet}
        </SelectValue>
        <ChevronDownIcon />
      </SelectTrigger>
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
