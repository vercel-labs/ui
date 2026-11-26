import { NgTemplateOutlet } from "@angular/common"
import { Component } from "@angular/core"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
  type TabsValueChange,
} from "@ui-sdk/angular/tabs"
import { createTabsController } from "@ui-sdk/core/tabs"
import {
  indicatorOptions,
  tabsOptions,
} from "../../../../../tests/fixtures/page"
import { tabsFixture } from "../../../../../tests/fixtures/tabs"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    NgTemplateOutlet,
    Tabs,
    TabsIndicator,
    TabsList,
    TabsPanel,
    TabsTab,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiTabs
        class="tabs"
        [defaultValue]="options.defaultValue"
        [activation]="options.activation"
        [orientation]="options.orientation"
        [controller]="controller"
        (beforeValueChange)="onValueChange($event)"
      >
        <div uiTabsList class="tablist" [attr.aria-label]="tabsFixture.label">
          @for (tab of tabsFixture.tabs; track tab.value) {
            <button
              uiTabsTab
              class="tab"
              [value]="tab.value"
              [disabled]="tab.disabled"
              [textContent]="tab.label"
            ></button>
          }
          <span
            uiTabsIndicator
            class="indicator"
            [followHover]="indicator.followHover"
          ></span>
        </div>
        @for (tab of tabsFixture.tabs; track tab.value) {
          @if (options.keepMounted) {
            <div uiTabsPanel class="panel" [value]="tab.value" keepMounted>
              <ng-container
                [ngTemplateOutlet]="content"
                [ngTemplateOutletContext]="{ $implicit: tab }"
              />
            </div>
          } @else {
            <div *uiTabsPanel="tab.value" class="panel">
              <ng-container
                [ngTemplateOutlet]="content"
                [ngTemplateOutletContext]="{ $implicit: tab }"
              />
            </div>
          }
        }
        <ng-template #content let-tab>
          {{ tab.content }}
          @if (tab.field) {
            <label> {{ tab.field }} <input type="password" /></label>
          }
        </ng-template>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.select('notifications')">
        Show notifications
      </button>
    </div>
  `,
})
class Fixture {
  readonly tabsFixture = tabsFixture
  readonly controller = createTabsController()
  readonly options: ReturnType<typeof tabsOptions> & {
    activation?: "automatic" | "manual"
    orientation?: "horizontal" | "vertical"
  } = tabsOptions()
  readonly indicator = indicatorOptions()
  readonly action = state("")

  onValueChange(change: TabsValueChange) {
    if (change.value === this.options.cancel) {
      return change.cancel()
    }
    this.action.set(change.value ?? "")
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
