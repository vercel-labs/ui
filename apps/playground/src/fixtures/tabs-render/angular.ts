import { Component } from "@angular/core"
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  type TabsValueChange,
} from "@ui-sdk/angular/tabs"
import { tabsOptions } from "../../../../../tests/fixtures/page"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Tabs, TabsList, TabsPanel, TabsTab],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiTabs
        class="tabs"
        defaultValue="overview"
        [activation]="options.activation"
        (beforeValueChange)="onValueChange($event)"
      >
        <div uiTabsList class="tablist" aria-label="Project">
          <a uiTabsTab class="tab" value="overview" href="#overview"
            >Overview</a
          >
          <a uiTabsTab class="tab" value="activity" href="#activity"
            >Activity</a
          >
          <button uiTabsTab #watched="uiTabsTab" class="tab" value="watched">
            Watched
            @if (watched.state().selected) {
              <span aria-hidden="true"> •</span>
            }
          </button>
          <button
            uiTabsTab
            #plain="uiTabsTab"
            class="tab"
            value="plain"
            [class.is-selected]="plain.state().selected"
            [class.is-unselected]="!plain.state().selected"
          >
            Plain
          </button>
        </div>
        @for (value of panels; track value) {
          <div *uiTabsPanel="value" class="panel">The {{ value }} panel.</div>
        }
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Reason">{{ reason() }}</output>
    </div>
  `,
})
class Fixture {
  readonly options = tabsOptions()
  readonly panels = ["overview", "activity", "watched", "plain"]
  readonly action = state("")
  readonly reason = state("")

  onValueChange(change: TabsValueChange) {
    this.action.set(change.value ?? "")
    this.reason.set(change.reason)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
