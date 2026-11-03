<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import { Listbox, ListboxItem, ListboxItemIndicator, type ListData } from "@ui-sdk/svelte/listbox"

  const plans = [
    { value: { id: "hobby", price: 0 }, label: "Hobby" },
    { value: { id: "pro", price: 20 }, label: "Pro" },
    { value: { id: "team", price: 50 }, label: "Team" },
    { value: { id: "enterprise", price: 200 }, label: "Enterprise", disabled: true },
  ] satisfies ListData<{ id: string; price: number }>

  let value = $state<{ id: string; price: number } | null>({ id: "pro", price: 20 })
</script>

<div data-slot="stack">
  <Listbox
    bind:value
    items={plans}
    itemToValue={(plan: { id: string }) => plan.id}
    isItemEqualToValue={(plan: { id: string }, selected: { id: string }) => plan.id === selected.id}
    aria-label="Plan"
  >
    {#each plans as plan (plan.value.id)}
      <ListboxItem value={plan.value} disabled={plan.disabled}>
        {plan.label}
        <ListboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
      </ListboxItem>
    {/each}
  </Listbox>
  <output data-slot="output">
    {value ? `${value.id}, $${value.price} a month` : "No plan"}
  </output>
</div>
