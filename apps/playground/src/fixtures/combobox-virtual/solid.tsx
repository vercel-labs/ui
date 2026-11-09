import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@ui-sdk/solid/combobox"
import { render } from "@solidjs/web"
import { createMemo, createSignal, For } from "solid-js"
import { longItems, scrollForRow, visibleRows } from "tests/fixtures/select.ts"

const items = longItems()
const row = 32
const height = 240

// 10,000 items, rendering only the rows in view. The combobox navigates and
// filters every item, and tells the list which row to scroll to.
function Fixture() {
  let scroller: HTMLDivElement | undefined
  const [scrollTop, setScrollTop] = createSignal(0)
  return (
    <div class="fixture">
      <button>Before</button>
      <Combobox
        items={items}
        onHighlight={(value, { index }) => {
          if (scroller && index >= 0) {
            scroller.scrollTop = scrollForRow(
              index,
              scroller.scrollTop,
              height,
              row
            )
          }
        }}
      >
        <ComboboxLabel class="label">Item</ComboboxLabel>
        <ComboboxInput class="input" />
        <ComboboxContent class="popup">
          <div
            ref={scroller}
            class="long-list"
            style={{ height: `${height}px` }}
            onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          >
            <ComboboxList style={{ position: "relative", height: "auto" }}>
              {(state) => {
                const visible = () =>
                  state.items as { value: string; label: string }[]
                const range = createMemo(() =>
                  visibleRows(scrollTop(), height, visible().length, row)
                )
                return (
                  <div
                    style={{
                      height: `${visible().length * row}px`,
                      position: "relative",
                    }}
                  >
                    <For each={visible().slice(range().start, range().end)}>
                      {(item, offset) => (
                        <ComboboxItem
                          class="item"
                          value={item.value}
                          label={item.label}
                          index={range().start + offset()}
                          style={{
                            position: "absolute",
                            top: `${(range().start + offset()) * row}px`,
                            height: `${row}px`,
                            left: "0",
                            right: "0",
                          }}
                        >
                          {item.label}
                        </ComboboxItem>
                      )}
                    </For>
                  </div>
                )
              }}
            </ComboboxList>
          </div>
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
