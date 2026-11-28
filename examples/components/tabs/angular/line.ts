import { Component } from "@angular/core"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/angular/tabs"

@Component({
  imports: [Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab],
  template: `
    <div uiTabs defaultValue="overview">
      <div uiTabsList aria-label="Dashboard">
        <button uiTabsTab value="overview">Overview</button>
        <button uiTabsTab value="analytics">Analytics</button>
        <button uiTabsTab value="reports">Reports</button>
        <span uiTabsIndicator></span>
      </div>
      <div uiTabsPanel value="overview">
        Revenue, visitors and sign-ups for the last 30 days.
      </div>
      <div uiTabsPanel value="analytics">
        Where visitors come from and what they do.
      </div>
      <div uiTabsPanel value="reports">Monthly reports, ready to download.</div>
    </div>
  `,
})
class Example {}

export { Example }
