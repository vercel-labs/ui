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

  const sizes = ["Extra small", "Small", "Medium", "Large", "Extra large"]

</script>

<div data-slot="stack">
  <Select placeholder="Select a size">
    <div data-slot="stack">
      <SelectLabel>Size</SelectLabel>
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
    </div>
    <SelectContent>
      {#each sizes as size (size)}
        <SelectItem value={size}>
          {size}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>
  <Select>
    <div data-slot="stack">
      <SelectLabel>Gift wrap</SelectLabel>
      <SelectTrigger>
        <SelectValue placeholder="None" />
        <ChevronDownIcon />
      </SelectTrigger>
    </div>
    <SelectContent>
      {#each ["Paper", "Ribbon", "Box"] as wrap (wrap)}
        <SelectItem value={wrap}>
          {wrap}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>
</div>
