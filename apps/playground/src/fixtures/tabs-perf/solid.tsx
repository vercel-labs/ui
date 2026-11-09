import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/solid/tabs"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// Many tabs for the counts specs.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Tabs class="tabs" defaultValue={items[0].value}>
        <TabsList
          class="tablist"
          aria-label="Pages"
          style={{ "flex-wrap": "wrap" }}
        >
          <For each={items}>
            {(item) => (
              <TabsTab class="tab" value={item.value}>
                {item.label}
              </TabsTab>
            )}
          </For>
        </TabsList>
        <For each={items}>
          {(item) => (
            <TabsPanel class="panel" value={item.value}>
              {item.label} content.
            </TabsPanel>
          )}
        </For>
      </Tabs>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
