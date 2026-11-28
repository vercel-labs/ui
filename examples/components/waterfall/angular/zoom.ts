import { Component, signal } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallColumnHeader,
  WaterfallHeaderRow,
  WaterfallIndicator,
  WaterfallRow,
  WaterfallRowHeader,
  WaterfallTick,
  type WaterfallData,
} from "@ui-sdk/angular/waterfall"

@Component({
  imports: [
    Waterfall,
    WaterfallAxis,
    WaterfallBar,
    WaterfallColumnHeader,
    WaterfallHeaderRow,
    WaterfallIndicator,
    WaterfallRow,
    WaterfallRowHeader,
    WaterfallTick,
    LucideChevronRight,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="range.set(zoomed(range(), 0.5))">
          Zoom In
        </button>
        <button type="button" (click)="range.set(zoomed(range(), 2))">
          Zoom Out
        </button>
        <button type="button" (click)="range.set(full)">Reset</button>
      </div>
      <div
        uiWaterfall
        aria-label="Dashboard render"
        [items]="trace"
        [range]="range()"
        [defaultExpanded]="['render']"
        defaultValue="metrics"
      >
        <div uiWaterfallHeaderRow>
          <div uiWaterfallColumnHeader>Span</div>
          <div uiWaterfallColumnHeader aria-label="Timeline">
            <div uiWaterfallAxis #waterfallAxis="uiWaterfallAxis">
              @for (tick of waterfallAxis.state().ticks; track tick.time) {
                <span uiWaterfallTick [time]="tick.time">{{ tick.label }}</span>
              }
            </div>
          </div>
        </div>
        @for (span of spans; track span.value) {
          <div uiWaterfallRow [value]="span.value">
            <div uiWaterfallRowHeader>
              @if (span.children) {
                <span uiWaterfallIndicator>
                  <svg lucideChevronRight></svg>
                </span>
              }
              {{ span.label }}
            </div>
            <div uiWaterfallBar></div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly trace: WaterfallData = [
    {
      value: "render",
      label: "render /dashboard",
      start: 0,
      duration: 1200,
      children: [
        { value: "session", label: "session", start: 20, duration: 80 },
        { value: "metrics", label: "metrics", start: 110, duration: 640 },
        { value: "alerts", label: "alerts", start: 110, duration: 260 },
        { value: "html", label: "stream html", start: 760, duration: 420 },
      ],
    },
  ]

  readonly spans = [this.trace[0], ...this.trace[0].children!]

  readonly full: [number, number] = [0, 1200]

  zoomed([start, end]: [number, number], factor: number) {
    const center = (start + end) / 2
    const half = Math.min(((end - start) * factor) / 2, this.full[1] / 2)
    const from = Math.min(
      Math.max(this.full[0], center - half),
      this.full[1] - half * 2
    )
    return [from, from + half * 2] as [number, number]
  }

  readonly range = signal(this.full)
}

export { Example }
