import { Component } from "@angular/core"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/angular/tabs"

@Component({
  imports: [Tabs, TabsList, TabsPanel, TabsTab],
  template: `
    <div uiTabs defaultValue="overview">
      <div uiTabsList aria-label="Dashboard">
        <button uiTabsTab value="overview">Overview</button>
        <button uiTabsTab value="analytics">Analytics</button>
        <button uiTabsTab value="reports" disabled>Reports</button>
      </div>
      <div uiTabsPanel value="overview">
        Revenue, visitors and sign-ups for the last 30 days.
      </div>
      <div uiTabsPanel value="analytics">
        Where your visitors come from and the pages they read most.
      </div>
      <div uiTabsPanel value="reports">
        Monthly reports are available on the Pro plan.
      </div>
    </div>
  `,
})
class Example {}

export { Example }
