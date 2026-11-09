import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { perfItems, perfModal, perfSize } from "tests/fixtures/perf.ts"

// Many popovers on one page, like a row action in every row of a table, for
// the counts specs. Only the first one is opened. ?modal opens them modal.
const items = perfItems(perfSize())
const modal = perfModal()

function Fixture() {
  return (
    <div class="fixture" style={{ "flex-wrap": "wrap" }}>
      <button>Before</button>
      <For each={items}>
        {(item) => (
          <Popover modal={modal}>
            <PopoverTrigger>{item.label}</PopoverTrigger>
            <PopoverContent class="popup" aria-label={item.label}>
              {item.label} details.
              <PopoverClose>Close</PopoverClose>
            </PopoverContent>
          </Popover>
        )}
      </For>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
