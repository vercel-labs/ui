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
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    type ListData,
  } from "@ui-sdk/svelte/select"

  const plans = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]

  const sales = [
    { value: "enterprise", label: "Enterprise" },
    { value: "education", label: "Education", disabled: true },
  ]

  const items: ListData = [
    ...plans,
    { type: "separator" },
    { type: "group", label: "Contact sales", items: sales },
  ]
</script>

<Select {items} defaultValue="pro">
  <div data-slot="stack">
    <SelectLabel>Plan</SelectLabel>
    <SelectTrigger>
      <SelectValue />
      <ChevronDownIcon />
    </SelectTrigger>
  </div>
  <SelectContent>
    {#each plans as plan (plan.value)}
      <SelectItem value={plan.value}>
        {plan.label}
        <SelectItemIndicator>
          <CheckIcon />
        </SelectItemIndicator>
      </SelectItem>
    {/each}
    <SelectSeparator />
    <SelectGroup>
      <SelectGroupLabel>Contact sales</SelectGroupLabel>
      {#each sales as plan (plan.value)}
        <SelectItem value={plan.value} disabled={plan.disabled}>
          {plan.label}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      {/each}
    </SelectGroup>
  </SelectContent>
</Select>
