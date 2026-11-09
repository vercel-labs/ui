import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import { createRoot } from "react-dom/client"
import { perfItems, perfModal, perfSize } from "tests/fixtures/perf.ts"

// Many popovers on one page, like a row action in every row of a table, for
// the counts specs. Only the first one is opened. ?modal opens them modal.
const items = perfItems(perfSize())
const modal = perfModal()

function Fixture() {
  return (
    <div className="fixture" style={{ flexWrap: "wrap" }}>
      <button>Before</button>
      {items.map((item) => (
        <Popover key={item.value} modal={modal}>
          <PopoverTrigger>{item.label}</PopoverTrigger>
          <PopoverContent className="popup" aria-label={item.label}>
            {item.label} details.
            <PopoverClose>Close</PopoverClose>
          </PopoverContent>
        </Popover>
      ))}
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
