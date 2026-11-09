import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { tabsOptions } from "tests/fixtures/page.ts"

function Fixture() {
  const [action, setAction] = React.useState("")
  const [reason, setReason] = React.useState("")
  const { activation } = tabsOptions()
  return (
    <div className="fixture">
      <button>Before</button>
      <Tabs
        className="tabs"
        defaultValue="overview"
        activation={activation}
        onValueChange={(value, details) => {
          setAction(value ?? "")
          setReason(details.reason)
        }}
      >
        <TabsList className="tablist" aria-label="Project">
          <TabsTab
            className="tab"
            value="overview"
            render={<a href="#overview" />}
          >
            Overview
          </TabsTab>
          <TabsTab
            className="tab"
            value="activity"
            render={<a href="#activity" />}
          >
            Activity
          </TabsTab>
          <TabsTab
            className="tab"
            value="watched"
            render={(props, state) => (
              <button {...props}>
                {props.children}
                {state.selected && <span aria-hidden> •</span>}
              </button>
            )}
          >
            Watched
          </TabsTab>
          <TabsTab
            value="plain"
            className={(state) =>
              `tab ${state.selected ? "is-selected" : "is-unselected"}`
            }
          >
            Plain
          </TabsTab>
        </TabsList>
        {["overview", "activity", "watched", "plain"].map((value) => (
          <TabsPanel key={value} className="panel" value={value}>
            The {value} panel.
          </TabsPanel>
        ))}
      </Tabs>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Reason">
        {reason}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
