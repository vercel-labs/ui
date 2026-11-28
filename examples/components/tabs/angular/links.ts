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
      <div uiTabsList aria-label="Project">
        @for (page of pages; track page.value) {
          <a uiTabsTab [value]="page.value" [href]="page.href">{{
            page.label
          }}</a>
        }
        <span uiTabsIndicator></span>
      </div>
      @for (page of pages; track page.value) {
        <div uiTabsPanel [value]="page.value">{{ page.content }}</div>
      }
    </div>
  `,
})
class Example {
  readonly pages = [
    {
      value: "overview",
      href: "#project-overview",
      label: "Overview",
      content:
        "Hollis Grant started this project in March. It has 14 open issues.",
    },
    {
      value: "activity",
      href: "#project-activity",
      label: "Activity",
      content:
        "Wren Takahashi merged 3 pull requests and closed 5 issues this week.",
    },
    {
      value: "members",
      href: "#project-members",
      label: "Members",
      content:
        "Hollis Grant owns the project. Wren Takahashi and 3 others can edit it.",
    },
  ]
}

export { Example }
