import { Component } from "@angular/core"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/angular/segmented-control"

@Component({
  imports: [SegmentedControl, SegmentedControlIndicator, SegmentedControlItem],
  template: `
    <div data-slot="stack">
      <div uiSegmentedControl aria-label="Theme" defaultValue="system" disabled>
        <span uiSegmentedControlIndicator></span>
        <button uiSegmentedControlItem value="light">Light</button>
        <button uiSegmentedControlItem value="dark">Dark</button>
        <button uiSegmentedControlItem value="system">System</button>
      </div>
      <div
        uiSegmentedControl
        aria-label="Billing period"
        defaultValue="monthly"
      >
        <span uiSegmentedControlIndicator></span>
        <button uiSegmentedControlItem value="monthly">Monthly</button>
        <button uiSegmentedControlItem value="yearly">Yearly</button>
        <button uiSegmentedControlItem value="lifetime" disabled>
          Lifetime
        </button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
