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

  const variants = ["disabled", "readOnly", "item"] as const
</script>

<div data-slot="stack">
  {#each variants as variant (variant)}
    <Select
      defaultValue={variant === "item" ? null : "banana"}
      placeholder="Select a fruit"
      disabled={variant === "disabled"}
      readOnly={variant === "readOnly"}
    >
      <div data-slot="stack">
        <SelectLabel>
          {variant === "disabled" ? "Disabled" : variant === "readOnly" ? "Read-only" : "Disabled item"}
        </SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent>
        {#each fruits as fruit (fruit.value)}
          <SelectItem value={fruit.value} disabled={fruit.value === "grapes"}>
            {fruit.label}
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        {/each}
      </SelectContent>
    </Select>
  {/each}
</div>
