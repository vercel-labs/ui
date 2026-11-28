import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  createSegmentedControlController,
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/angular/segmented-control"

@Component({
  imports: [SegmentedControl, SegmentedControlIndicator, SegmentedControlItem],
  template: `
    <div>
      <div data-slot="controls">
        <button type="button" (click)="range.setValue('month')">
          Show Month
        </button>
      </div>
      <div
        uiSegmentedControl
        aria-label="Range"
        [(value)]="value"
        (beforeValueChange)="
          log('value: ' + $event.value + ' (' + $event.reason + ')')
        "
        [controller]="range"
      >
        <span uiSegmentedControlIndicator></span>
        <button uiSegmentedControlItem value="day">Day</button>
        <button uiSegmentedControlItem value="week">Week</button>
        <button uiSegmentedControlItem value="month">Month</button>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly range = createSegmentedControlController()

  readonly value = signal<string | null>("week")
}

export { Example }
