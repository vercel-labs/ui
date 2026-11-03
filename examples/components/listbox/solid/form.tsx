import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/solid/listbox"
import { createSignal, For } from "solid-js"

const toppings = [
  { value: "basil", label: "Basil" },
  { value: "cheese", label: "Extra cheese" },
  { value: "mushroom", label: "Mushroom" },
  { value: "olive", label: "Olive" },
  { value: "onion", label: "Onion" },
  { value: "pepper", label: "Pepper" },
]

function Example() {
  const [submitted, setSubmitted] = createSignal("")

  return (
    <div data-slot="stack">
      <form
        id="pizza-order"
        data-slot="row"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setSubmitted(data.getAll("toppings").join(", "))
        }}
      >
        <button>Order</button>
        <button type="reset">Reset</button>
      </form>
      <Listbox
        multiple
        name="toppings"
        form="pizza-order"
        required
        defaultValue={["cheese"]}
        aria-label="Toppings"
      >
        <For each={toppings}>
          {(topping) => (
            <ListboxItem value={topping.value}>
              {topping.label}
              <ListboxItemIndicator>
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
              </ListboxItemIndicator>
            </ListboxItem>
          )}
        </For>
      </Listbox>
      <output data-slot="output">Submitted: {submitted() || "nothing yet"}</output>
    </div>
  )
}

export { Example }
