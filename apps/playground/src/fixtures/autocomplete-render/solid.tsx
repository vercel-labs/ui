import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteTrigger,
} from "@ui-sdk/solid/autocomplete"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { autocompleteFixture as f } from "tests/fixtures/autocomplete.ts"

// Parts rendered as other elements, with render functions and class names of state.
function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Autocomplete name={f.name}>
        <AutocompleteLabel class="label">{f.label}</AutocompleteLabel>
        <AutocompleteInput
          class={(state) => `input ${state.open ? "is-open" : "is-closed"}`}
        />
        <AutocompleteTrigger aria-label={f.trigger}>▾</AutocompleteTrigger>
        <AutocompleteContent class="popup list-popup">
          <AutocompleteList>
            <AutocompleteItem
              class="item"
              value="docs"
              label="Docs"
              render={(props) => <a {...props} href="#docs" />}
            >
              Docs
            </AutocompleteItem>
            <For each={f.items.slice(0, 3)}>
              {(item) => (
                <AutocompleteItem
                  class="item"
                  value={item.value}
                  label={item.label}
                  render={(props, state) => (
                    <div {...props}>
                      {item.label}
                      {state.highlighted ? " ←" : ""}
                    </div>
                  )}
                />
              )}
            </For>
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
