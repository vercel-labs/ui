import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
  createTabsController,
} from "@ui-sdk/angular/tabs"

@Component({
  imports: [Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab],
  template: `
    <div>
      <div data-slot="controls">
        <button type="button" (click)="tabs.select('sent')">
          Show Sent Mail
        </button>
      </div>
      <div
        uiTabs
        [(value)]="value"
        (beforeValueChange)="
          log('value: ' + $event.value + ' (' + $event.reason + ')')
        "
        [controller]="tabs"
      >
        <div uiTabsList aria-label="Mail">
          <button uiTabsTab value="inbox">Inbox</button>
          <button uiTabsTab value="drafts">Drafts</button>
          <button uiTabsTab value="sent">Sent</button>
          <span uiTabsIndicator></span>
        </div>
        <div uiTabsPanel value="inbox">
          3 unread messages from Hollis Grant and Inès Moreau.
        </div>
        <div uiTabsPanel value="drafts">
          2 drafts, the last one edited yesterday at 4:12 PM.
        </div>
        <div uiTabsPanel value="sent">
          12 messages sent this week, all delivered.
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly tabs = createTabsController()

  readonly value = signal<string | null>("inbox")
}

export { Example }
