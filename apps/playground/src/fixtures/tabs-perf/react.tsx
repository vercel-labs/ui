import * as React from "react"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import { createRoot } from "react-dom/client"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// Many tabs for the counts specs.
const items = perfItems(perfSize())

// `?controlled` keeps the value in this component, which renders again on
// every change, like an app that shows the selected tab elsewhere.
const controlled = new URLSearchParams(location.search).has("controlled")

function Fixture() {
  const [value, setValue] = React.useState<string>(items[0].value)
  return (
    <div className="fixture">
      <button>Before</button>
      <Tabs
        className="tabs"
        {...(controlled
          ? {
              value,
              onValueChange: (next: string | null) =>
                setValue(next ?? items[0].value),
            }
          : { defaultValue: items[0].value })}
      >
        <TabsList
          className="tablist"
          aria-label="Pages"
          style={{ flexWrap: "wrap" }}
        >
          {items.map((item) => (
            <TabsTab key={item.value} className="tab" value={item.value}>
              {item.label}
            </TabsTab>
          ))}
        </TabsList>
        {items.map((item) => (
          <TabsPanel key={item.value} className="panel" value={item.value}>
            {item.label} content.
          </TabsPanel>
        ))}
      </Tabs>
      {controlled && <p>Showing {value}</p>}
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
