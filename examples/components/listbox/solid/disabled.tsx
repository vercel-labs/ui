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
  const [disabled, setDisabled] = createSignal(false)

  return (
    <div data-slot="stack">
      <Listbox multiple disabled={disabled()} defaultValue={["basil"]} aria-label="Toppings">
        <For each={toppings}>
          {(topping) => (
            <ListboxItem value={topping.value} disabled={topping.value === "olive"}>
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
      <button type="button" onClick={() => setDisabled(!disabled())}>
        {disabled() ? "Enable" : "Disable"} the list
      </button>
    </div>
  )
}

export { Example }
