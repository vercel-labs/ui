import { Component } from "@angular/core"
import { LucideArchive, LucideMail, LucideReply } from "@lucide/angular"
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  TabsTabIcon,
} from "@ui-sdk/angular/tabs"

@Component({
  imports: [
    Tabs,
    TabsList,
    TabsPanel,
    TabsTab,
    TabsTabIcon,
    LucideArchive,
    LucideMail,
    LucideReply,
  ],
  template: `
    <div uiTabs defaultValue="inbox">
      <div uiTabsList aria-label="Mail">
        <button uiTabsTab value="inbox">
          <span uiTabsTabIcon>
            <svg lucideMail></svg>
          </span>
          Inbox
        </button>
        <button uiTabsTab value="replies">
          <span uiTabsTabIcon mirror>
            <svg lucideReply></svg>
          </span>
          Replies
        </button>
        <button uiTabsTab value="archive">
          <span uiTabsTabIcon>
            <svg lucideArchive></svg>
          </span>
          Archive
        </button>
      </div>
      <div uiTabsPanel value="inbox">
        3 new messages from Inès Moreau and Kofi Mensah.
      </div>
      <div uiTabsPanel value="replies">
        Wren Takahashi replied to your message about the launch.
      </div>
      <div uiTabsPanel value="archive">
        Messages you archived stay here and in search.
      </div>
    </div>
  `,
})
class Example {}

export { Example }
