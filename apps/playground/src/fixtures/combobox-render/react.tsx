import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/react/combobox"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { comboboxFixture as f } from "tests/fixtures/combobox.ts"

// Parts rendered as other elements, with render functions and class names of state.
function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Combobox name={f.name}>
        <ComboboxLabel className="label">{f.label}</ComboboxLabel>
        <ComboboxInput
          className={(state) => `input ${state.open ? "is-open" : "is-closed"}`}
        />
        <ComboboxTrigger aria-label={f.trigger}>▾</ComboboxTrigger>
        <ComboboxContent className="popup list-popup">
          <ComboboxList>
            <ComboboxItem
              className="item"
              value="docs"
              label="Docs"
              render={<a href="#docs" />}
            >
              Docs
            </ComboboxItem>
            {f.items.slice(0, 3).map((item) => (
              <ComboboxItem
                key={item.value}
                className="item"
                value={item.value}
                label={item.label}
                render={(props, state) => (
                  <div {...props}>
                    {item.label}
                    {state.highlighted ? " ←" : ""}
                  </div>
                )}
              />
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { mount }
