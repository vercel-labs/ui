import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-sdk/react/command"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { longItems, scrollForRow, visibleRows } from "tests/fixtures/select.ts"

const items = longItems()
const row = 32
const height = 240

// 10,000 commands, rendering only the rows in view. The command ranks and
// moves through every one, and its value change says which row to scroll to.
function Fixture() {
  const scroller = React.useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = React.useState(0)
  return (
    <div className="fixture">
      <button>Before</button>
      <Command
        className="command"
        items={items}
        onValueChange={(value, { index }) => {
          const el = scroller.current
          if (el && index >= 0) {
            el.scrollTop = scrollForRow(index, el.scrollTop, height, row)
          }
        }}
      >
        <CommandInput className="input" aria-label="Search items" />
        <div
          ref={scroller}
          className="long-list"
          style={{ height }}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          <CommandList
            style={{
              position: "relative",
              maxHeight: "none",
              overflow: "visible",
            }}
          >
            {(state) => {
              const visible = state.items as { value: string; label: string }[]
              const { start, end } = visibleRows(
                scrollTop,
                height,
                visible.length,
                row
              )
              return (
                <div
                  style={{ height: visible.length * row, position: "relative" }}
                >
                  {visible.slice(start, end).map((item, offset) => (
                    <CommandItem
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
                    </CommandItem>
                  ))}
                </div>
              )
            }}
          </CommandList>
        </div>
      </Command>
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
