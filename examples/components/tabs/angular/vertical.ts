import { Component } from "@angular/core"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/angular/tabs"

@Component({
  imports: [Tabs, TabsList, TabsPanel, TabsTab],
  template: `
    <div uiTabs defaultValue="general" orientation="vertical">
      <div uiTabsList aria-label="Preferences">
        <button uiTabsTab value="general">General</button>
        <button uiTabsTab value="security">Security</button>
        <button uiTabsTab value="integrations">Integrations</button>
      </div>
      <div uiTabsPanel value="general">
        Choose your language, time zone and the page you start on.
      </div>
      <div uiTabsPanel value="security">
        Manage passkeys, signed-in sessions and recovery codes.
      </div>
      <div uiTabsPanel value="integrations">
        Connect your calendar and chat apps to get reminders.
      </div>
    </div>
  `,
})
class Example {}

export { Example }
