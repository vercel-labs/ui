import { createTabsController } from "@ui-sdk/core/tabs"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/react/tabs"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { tabsOptions } from "tests/fixtures/page.ts"
import { tabsFixture } from "tests/fixtures/tabs.ts"

const controller = createTabsController()

function Fixture() {
  const [action, setAction] = React.useState("")
  const { cancel, keepMounted, ...options } = tabsOptions()
  return (
    <div className="fixture">
      <button>Before</button>
      <Tabs
        className="tabs"
        controller={controller}
        {...options}
        onValueChange={(value, details) => {
          if (value === cancel) {
            return details.cancel()
          }
          setAction(value ?? "")
        }}
      >
        <TabsList className="tablist" aria-label={tabsFixture.label}>
          {tabsFixture.tabs.map((tab) => (
            <TabsTab
              key={tab.value}
              className="tab"
              value={tab.value}
              disabled={tab.disabled}
            >
              {tab.label}
            </TabsTab>
          ))}
          <TabsIndicator className="indicator" />
        </TabsList>
        {tabsFixture.tabs.map((tab) => (
          <TabsPanel
            key={tab.value}
            className="panel"
            value={tab.value}
            keepMounted={keepMounted}
          >
            {tab.content}
            {tab.field && (
              <label>
                {" "}
                {tab.field} <input type="password" />
              </label>
            )}
          </TabsPanel>
        ))}
      </Tabs>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <button onClick={() => controller.select("notifications")}>
        Show notifications
      </button>
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

export { Fixture, mount }
