import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@ui-sdk/react/combobox"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { longItems, scrollForRow, visibleRows } from "tests/fixtures/select.ts"

const items = longItems()
const row = 32
const height = 240

// 10,000 items, rendering only the rows in view. The combobox navigates and
// filters every item, and tells the list which row to scroll to.
function Fixture() {
  const scroller = React.useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = React.useState(0)
  return (
    <div className="fixture">
      <button>Before</button>
      <Combobox
        items={items}
        onHighlight={(value, { index }) => {
          const el = scroller.current
          if (el && index >= 0) {
            el.scrollTop = scrollForRow(index, el.scrollTop, height, row)
          }
        }}
      >
        <ComboboxLabel className="label">Item</ComboboxLabel>
        <ComboboxInput className="input" />
        <ComboboxContent className="popup">
          <div
            ref={scroller}
            className="long-list"
            style={{ height }}
            onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          >
            <ComboboxList style={{ position: "relative", height: "auto" }}>
              {(state) => {
                const visible = state.items as {
                  value: string
                  label: string
                }[]
                const { start, end } = visibleRows(
                  scrollTop,
                  height,
                  visible.length,
                  row
                )
                return (
                  <div
                    style={{
                      height: visible.length * row,
                      position: "relative",
                    }}
                  >
                    {visible.slice(start, end).map((item, offset) => (
                      <ComboboxItem
                        key={item.value}
                        className="item"
                        value={item.value}
                        label={item.label}
                        index={start + offset}
                        style={{
                          position: "absolute",
                          top: (start + offset) * row,
                          height: row,
                          left: 0,
                          right: 0,
                        }}
                      >
                        {item.label}
                      </ComboboxItem>
                    ))}
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
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { mount }
