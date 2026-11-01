<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"

  const toppings = [
    { value: "cheese", label: "Cheese" },
    { value: "mushrooms", label: "Mushrooms" },
    { value: "olives", label: "Olives" },
    { value: "peppers", label: "Peppers" },
  ]

  let submitted = $state<string | null>(null)

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = new FormData(event.target as HTMLFormElement).getAll("toppings").join(", ")
  }
</script>

<div data-slot="stack">
  <h3 id="form-toppings">Toppings</h3>
  <p data-slot="hint">Choose at least one.</p>
  <CheckboxGroup
    aria-labelledby="form-toppings"
    name="toppings"
    form="toppings-form"
    defaultValue={["cheese"]}
    required
  >
    {#each toppings as topping (topping.value)}
      <label data-slot="label">
        <Checkbox value={topping.value}>
          <CheckboxIndicator>
            <Check aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        {topping.label}
      </label>
    {/each}
  </CheckboxGroup>
  <form data-slot="row" id="toppings-form" onsubmit={onSubmit} onreset={() => (submitted = null)}>
    <button type="submit">
      Submit
    </button>
    <button type="reset">
      Reset
    </button>
  </form>
  <output data-slot="output">{submitted !== null ? `toppings: ${submitted}` : ""}</output>
</div>
