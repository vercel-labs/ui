<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectGroupLabel,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    type ListData,
  } from "@ui-sdk/svelte/select"

  const sizeGroups = [
    { type: "group", label: "Common", items: ["Small", "Medium", "Large"] },
    { type: "group", label: "Extended", items: ["Extra small", "Extra large"] },
  ] satisfies ListData

</script>

<Select items={sizeGroups} name="size" defaultValue="Medium">
  <div data-slot="stack">
    <SelectLabel>Size</SelectLabel>
    <SelectTrigger>
      <SelectValue />
      <ChevronDownIcon />
    </SelectTrigger>
  </div>
  <SelectContent>
    {#each sizeGroups as group (group.label)}
      <SelectGroup>
        <SelectGroupLabel>{group.label}</SelectGroupLabel>
        {#each group.items as size (size)}
          <SelectItem value={size}>
            {size}
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        {/each}
      </SelectGroup>
    {/each}
  </SelectContent>
</Select>
