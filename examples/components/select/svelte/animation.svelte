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

  let status = $state("Closed")
</script>

<Select
  defaultValue="banana"
  onOpenChange={(open) => (status = open ? "Opening…" : "Closing…")}
  onOpenChangeComplete={(open) => (status = open ? "Open" : "Closed")}
>
  <div data-slot="stack">
    <SelectLabel>Fruit</SelectLabel>
    <SelectTrigger>
      <SelectValue />
      <ChevronDownIcon />
    </SelectTrigger>
    <output data-slot="output">{status}</output>
  </div>
  <SelectContent>
    {#each fruits as fruit (fruit.value)}
      <SelectItem value={fruit.value}>
        {fruit.label}
        <SelectItemIndicator keepMounted>
          <CheckIcon />
        </SelectItemIndicator>
      </SelectItem>
    {/each}
  </SelectContent>
</Select>
