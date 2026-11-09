import { Toolbar, ToolbarButton } from "@ui-sdk/solid/toolbar"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { mountWhenAsked, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A toolbar with many buttons for the counts specs.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Toolbar
        class="toolbar"
        aria-label="Formatting"
        style={{ "flex-wrap": "wrap" }}
      >
        <For each={items}>
          {(item) => <ToolbarButton>{item.label}</ToolbarButton>}
        </For>
      </Toolbar>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => render(() => <Fixture />, target))
}

export { mount }
