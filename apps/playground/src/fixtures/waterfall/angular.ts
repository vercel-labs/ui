import { Component } from "@angular/core"
import {
  createWaterfallController,
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallCell,
  WaterfallColumnHeader,
  type WaterfallExpandedChange,
  WaterfallHeaderRow,
  WaterfallIndicator,
  WaterfallMark,
  WaterfallRow,
  WaterfallRowHeader,
} from "@ui-sdk/angular/waterfall"
import {
  describeWaterfall,
  flatWaterfall,
  waterfallFixture,
  waterfallOptions,
} from "../../../../../tests/fixtures/waterfall"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Waterfall,
    WaterfallAxis,
    WaterfallBar,
    WaterfallCell,
    WaterfallColumnHeader,
    WaterfallHeaderRow,
    WaterfallIndicator,
    WaterfallMark,
    WaterfallRow,
    WaterfallRowHeader,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiWaterfall
        [attr.aria-label]="f.label"
        [items]="f.items"
        [controller]="controller"
        [range]="range()"
        [defaultExpanded]="options.defaultExpanded"
        [defaultValue]="options.defaultValue"
        (valueChange)="action.set(describe('selected', $event))"
        (beforeExpandedChange)="onExpandedChange($event)"
      >
        <div uiWaterfallHeaderRow>
          <div uiWaterfallColumnHeader>Name</div>
          <div uiWaterfallColumnHeader>Status</div>
          <div uiWaterfallColumnHeader aria-label="Timeline">
            <div uiWaterfallAxis></div>
            <div uiWaterfallMark [time]="f.mark.time">{{ f.mark.label }}</div>
          </div>
        </div>
        @for (span of spans; track span.value) {
          <div uiWaterfallRow [value]="span.value">
            <div uiWaterfallRowHeader>
              @if (span.children) {
                <span uiWaterfallIndicator></span>
              }
              {{ span.label }}
            </div>
            <div uiWaterfallCell>{{ span.status }}</div>
            <div uiWaterfallBar></div>
          </div>
        }
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.expandAll()">Expand all</button>
      <button (click)="controller.collapseAll()">Collapse all</button>
      <button (click)="controller.reveal('flags')">Reveal flags</button>
      <button (click)="range.set([500, 1000])">Zoom</button>
    </div>
  `,
})
class Fixture {
  readonly f = waterfallFixture
  readonly describe = describeWaterfall
  readonly spans = flatWaterfall(waterfallFixture.items)
  readonly controller = createWaterfallController()
  readonly options = waterfallOptions()
  readonly range = state(this.options.range)
  readonly action = state("")

  onExpandedChange(change: WaterfallExpandedChange) {
    const { cancel } = this.options
    if (
      cancel &&
      change.value.includes(cancel) &&
      !this.controller.isExpanded(cancel)
    ) {
      return change.cancel()
    }
    this.action.set(describeWaterfall("expanded", change.value))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
