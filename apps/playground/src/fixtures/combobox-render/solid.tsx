import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/solid/combobox"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { comboboxFixture as f } from "tests/fixtures/combobox.ts"

// Parts rendered as other elements, with render functions and class names of state.
function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Combobox name={f.name}>
        <ComboboxLabel class="label">{f.label}</ComboboxLabel>
        <ComboboxInput
          class={(state) => `input ${state.open ? "is-open" : "is-closed"}`}
        />
        <ComboboxTrigger aria-label={f.trigger}>▾</ComboboxTrigger>
        <ComboboxContent class="popup list-popup">
          <ComboboxList>
            <ComboboxItem
              class="item"
              value="docs"
              label="Docs"
              render={(props) => <a {...props} href="#docs" />}
            >
              Docs
            </ComboboxItem>
            <For each={f.items.slice(0, 3)}>
              {(item) => (
                <ComboboxItem
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
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
