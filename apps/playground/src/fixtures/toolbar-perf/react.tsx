import { Toolbar, ToolbarButton } from "@ui-sdk/react/toolbar"
import { createRoot } from "react-dom/client"
import { mountWhenAsked, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A toolbar with many buttons for the counts specs.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Toolbar
        className="toolbar"
        aria-label="Formatting"
        style={{ flexWrap: "wrap" }}
      >
        {items.map((item) => (
          <ToolbarButton key={item.value}>{item.label}</ToolbarButton>
        ))}
      </Toolbar>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => createRoot(target).render(<Fixture />))
}

export { mount }
