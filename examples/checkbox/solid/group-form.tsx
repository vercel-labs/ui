import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { createSignal, For } from "solid-js"

const toppings = [
  { value: "cheese", label: "Cheese" },
  { value: "mushrooms", label: "Mushrooms" },
  { value: "olives", label: "Olives" },
  { value: "peppers", label: "Peppers" },
]

function Example() {
  const [submitted, setSubmitted] = createSignal<string | null>(null)

  return (
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
        <For each={toppings}>
          {(topping) => (
            <label data-slot="label">
              <Checkbox value={topping.value}>
                <CheckboxIndicator>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </CheckboxIndicator>
              </Checkbox>
              {topping.label}
            </label>
          )}
        </For>
      </CheckboxGroup>
      <form
        data-slot="row"
        id="toppings-form"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(new FormData(event.currentTarget).getAll("toppings").join(", "))
        }}
        onReset={() => setSubmitted(null)}
      >
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <output data-slot="output">{submitted() !== null ? `toppings: ${submitted()}` : ""}</output>
    </div>
  )
}

export { Example }
