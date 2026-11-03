<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/svelte/listbox"

  const toppings = [
    { value: "basil", label: "Basil" },
    { value: "cheese", label: "Extra cheese" },
    { value: "mushroom", label: "Mushroom" },
    { value: "olive", label: "Olive" },
    { value: "onion", label: "Onion" },
    { value: "pepper", label: "Pepper" },
  ]

  let value = $state<string[]>(["cheese", "onion"])
</script>

<div data-slot="stack">
  <Listbox bind:value multiple aria-label="Toppings">
    {#each toppings as topping (topping.value)}
      <ListboxItem value={topping.value}>
        <ListboxItemIndicator keepMounted>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
        {topping.label}
      </ListboxItem>
    {/each}
  </Listbox>
  <output data-slot="output">Value: {JSON.stringify(value)}</output>
</div>
