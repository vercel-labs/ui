<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectGroupLabel,
    SelectItem,
    SelectItemIndicator,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"

  const produce = [
    {
      label: "Fruits",
      items: [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "orange", label: "Orange" },
      ],
    },
    {
      label: "Vegetables",
      items: [
        { value: "carrot", label: "Carrot" },
        { value: "broccoli", label: "Broccoli" },
        { value: "spinach", label: "Spinach" },
      ],
    },
  ]
</script>

<Select placeholder="Select produce">
  <SelectTrigger aria-label="Produce">
    <SelectValue />
    <ChevronDownIcon />
  </SelectTrigger>
  <SelectContent>
    {#each produce as group, index (group.label)}
      {#if index > 0}
        <SelectSeparator />
      {/if}
      <SelectGroup>
        <SelectGroupLabel>
          {group.label}
        </SelectGroupLabel>
        {#each group.items as item (item.value)}
          <SelectItem value={item.value}>
            {item.label}
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        {/each}
      </SelectGroup>
    {/each}
  </SelectContent>
</Select>
