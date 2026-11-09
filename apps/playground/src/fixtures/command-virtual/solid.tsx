import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-sdk/solid/command"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import { longItems, scrollForRow, visibleRows } from "tests/fixtures/select.ts"

const items = longItems()
const row = 32
const height = 240

// 10,000 commands, rendering only the rows in view. The command ranks and
// moves through every one, and its value change says which row to scroll to.
function Fixture() {
  let scroller: HTMLDivElement | undefined
  const [scrollTop, setScrollTop] = createSignal(0)
  return (
    <div class="fixture">
      <button>Before</button>
      <Command
        class="command"
        items={items}
        onValueChange={(value, { index }) => {
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
        <CommandInput class="input" aria-label="Search items" />
        <div
          ref={scroller}
          class="long-list"
          style={{ height: `${height}px` }}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          <CommandList
            style={{
              position: "relative",
              "max-height": "none",
              overflow: "visible",
            }}
          >
            {(state) => {
              const visible = () =>
                state.items as { value: string; label: string }[]
              const window = () =>
                visibleRows(scrollTop(), height, visible().length, row)
              return (
                <div
                  style={{
                    height: `${visible().length * row}px`,
                    position: "relative",
                  }}
                >
                  <For each={visible().slice(window().start, window().end)}>
                    {(item, offset) => (
                      <CommandItem
                        class="item"
                        value={item.value}
                        label={item.label}
                        index={window().start + offset()}
                        style={{
                          position: "absolute",
                          top: `${(window().start + offset()) * row}px`,
                          height: `${row}px`,
                          left: "0",
                          right: "0",
                        }}
                      >
                        {item.label}
                      </CommandItem>
                    )}
                  </For>
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
  render(() => <Fixture />, root)
}

export { Fixture, mount }
