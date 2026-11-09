import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@ui-sdk/solid/combobox"
import { render } from "@solidjs/web"
import { For, untrack } from "solid-js"
import { countRender, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A long combobox for the counts specs. Every other option
// reads `highlighted` in its render function, so specs can tell plain
// options' renders from watched ones.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Combobox>
        <ComboboxInput aria-label="Search" class="input" />
        <ComboboxContent class="popup list-popup">
          <ComboboxList>
            <For each={items}>
              {(item, index) =>
                // The list never reorders, so a row reads its place once.
                untrack(index) % 2 ? (
                  <ComboboxItem
                    class="item"
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
                    class="item"
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
              }
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
