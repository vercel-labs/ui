import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@ui-sdk/solid/autocomplete"
import { For, Show } from "solid-js"

const fruits = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry"]

function Example() {
  return (
    <Autocomplete required>
      <div data-slot="stack">
        <AutocompleteLabel>Fruit</AutocompleteLabel>
        <AutocompleteInput />
      </div>
      <AutocompleteContent>
        <AutocompleteList>
          <AutocompleteItem value="Fruit guide" render={(props) => <a {...props} href="#fruit-guide" />}>
            Read the fruit guide
          </AutocompleteItem>
          <For each={fruits}>
            {(fruit) => (
              <AutocompleteItem value={fruit}>
                {(state) => (
                  <>
                    {fruit}
                    <Show when={state.highlighted}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                      </svg>
                    </Show>
                  </>
                )}
              </AutocompleteItem>
            )}
          </For>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
}

export { Example }
