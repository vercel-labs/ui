import { Component } from "@angular/core"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/angular/tabs"

@Component({
  imports: [Tabs, TabsList, TabsPanel, TabsTab],
  template: `
    <div uiTabs defaultValue="account">
      <div uiTabsList aria-label="Settings">
        <button uiTabsTab value="account">Account</button>
        <button uiTabsTab value="password">Password</button>
      </div>
      <div uiTabsPanel value="account">
        Update your name, email address and profile photo. Your team sees
        changes right away.
      </div>
      <div uiTabsPanel value="password">
        Choose a new password for hollis@example.com. You stay signed in on this
        device.
      </div>
    </div>
  `,
})
class Example {}

export { Example }
