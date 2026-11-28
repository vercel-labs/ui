import { Component } from "@angular/core"
import {
  createSegmentedControlController,
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
  type SegmentedControlValueChange,
} from "@ui-sdk/angular/segmented-control"
import {
  indicatorOptions,
  segmentedControlOptions,
} from "../../../../../tests/fixtures/page"
import { segmentedControlFixture } from "../../../../../tests/fixtures/segmented-control"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [SegmentedControl, SegmentedControlIndicator, SegmentedControlItem],
  template: `
    <form class="fixture" (submit)="onSubmit($event)">
      <button type="button">Before</button>
      <div
        uiSegmentedControl
        [attr.aria-label]="fixture.label"
        [name]="fixture.name"
        [defaultValue]="options.defaultValue"
        [disabled]="options.disabled"
        [orientation]="options.orientation"
        [controller]="controller"
        (beforeValueChange)="onValueChange($event)"
      >
        <span
          uiSegmentedControlIndicator
          [followHover]="indicator.followHover"
        ></span>
        @for (item of fixture.items; track item.value) {
          <button
            uiSegmentedControlItem
            [value]="item.value"
            [disabled]="item.disabled"
          >
            {{ item.label }}
          </button>
        }
      </div>
      <button type="button">After</button>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" (click)="controller.setValue('calendar')">
        Show calendar
      </button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Submitted">{{ submitted() }}</output>
    </form>
  `,
})
class Fixture {
  readonly controller = createSegmentedControlController()
  readonly options = segmentedControlOptions()
  readonly indicator = indicatorOptions()
  readonly fixture = segmentedControlFixture
  readonly action = state("")
  readonly submitted = state("")

  onValueChange(change: SegmentedControlValueChange) {
    if (change.value === this.options.cancel) {
      return change.cancel()
    }
    this.action.set(`${change.value}:${change.reason}`)
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.submitted.set(
      Array.from(
        new FormData(event.currentTarget as HTMLFormElement),
        ([key, value]) => `${key}=${value}`
      ).join("&")
    )
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
