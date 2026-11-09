import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@ui-sdk/react/combobox"
import { createRoot } from "react-dom/client"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A long combobox for the counts specs. Every other option
// reads `highlighted` in its render function, so specs can tell plain
// options' renders from watched ones.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Combobox>
        <ComboboxInput aria-label="Search" className="input" />
        <ComboboxContent className="popup list-popup">
          <ComboboxList>
            {items.map((item, index) =>
              index % 2 ? (
                <ComboboxItem
                  key={item.value}
                  className="item"
                  value={item.value}
                  label={item.label}
                  render={(props, state) => {
                    countRender("watched")
                    return (
                      <div {...props}>
                        {state.highlighted ? "→ " : ""}
                        {props.children}
                      </div>
                    )
                  }}
                >
                  {item.label}
                </ComboboxItem>
              ) : (
                <ComboboxItem
                  key={item.value}
                  className="item"
                  value={item.value}
                  label={item.label}
                  render={(props) => {
                    countRender("plain")
                    return <div {...props} />
                  }}
                >
                  {item.label}
                </ComboboxItem>
              )
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
