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

  let submitted = $state("")

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = new FormData(event.target as HTMLFormElement).getAll("toppings").join(", ")
  }
</script>

<div data-slot="stack">
  <form id="pizza-order" data-slot="row" onsubmit={onSubmit}>
    <button>
      Order
    </button>
    <button type="reset">
      Reset
    </button>
  </form>
  <Listbox
    multiple
    name="toppings"
    form="pizza-order"
    required
    defaultValue={["cheese"]}
    aria-label="Toppings"
  >
    {#each toppings as topping (topping.value)}
      <ListboxItem value={topping.value}>
        {topping.label}
        <ListboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
      </ListboxItem>
    {/each}
  </Listbox>
  <output data-slot="output">Submitted: {submitted || "nothing yet"}</output>
</div>
