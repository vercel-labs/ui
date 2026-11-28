import { Component, computed, signal } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  createWaterfallController,
  visibleWaterfallRows,
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallColumnHeader,
  WaterfallHeaderRow,
  WaterfallIndicator,
  WaterfallRow,
  WaterfallRowHeader,
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
    LucideChevronRight,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="spans.expandAll()">Expand All</button>
        <button type="button" (click)="spans.collapseAll()">
          Collapse All
        </button>
      </div>
      <div
        uiWaterfall
        aria-label="Checkout trace"
        [items]="trace"
        [controller]="spans"
        [(expanded)]="expanded"
        [(value)]="value"
        (beforeValueChange)="log('Selected ' + $event.value)"
        [format]="{ style: 'unit', unit: 'millisecond', unitDisplay: 'narrow' }"
      >
        <div uiWaterfallHeaderRow>
          <div uiWaterfallColumnHeader>Span</div>
          <div uiWaterfallColumnHeader aria-label="Timeline">
            <div uiWaterfallAxis></div>
          </div>
        </div>
        @for (entry of rows(); track entry.item.value) {
          <div uiWaterfallRow [value]="entry.item.value">
            <div uiWaterfallRowHeader>
              @if (entry.item.children) {
                <span uiWaterfallIndicator>
                  <svg lucideChevronRight></svg>
                </span>
              }
              {{ entry.item.label }}
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
      value: "checkout",
      label: "POST /checkout",
      start: 0,
      duration: 920,
      children: [
        { value: "auth", label: "auth.verify", start: 12, duration: 64 },
        {
          value: "cart",
          label: "cart.load",
          start: 80,
          duration: 310,
          children: [
            {
              value: "cart-db",
              label: "db.query carts",
              start: 96,
              duration: 140,
            },
            {
              value: "prices",
              label: "pricing.quote",
              start: 240,
              duration: 136,
            },
          ],
        },
        {
          value: "payment",
          label: "payments.charge",
          start: 400,
          duration: 470,
          children: [
            { value: "fraud", label: "fraud.score", start: 410, duration: 120 },
            {
              value: "gateway",
              label: "gateway.capture",
              start: 540,
              duration: 310,
            },
          ],
        },
        { value: "email", label: "email.enqueue", start: 880, duration: 30 },
      ],
    },
  ]

  readonly log = useLog()

  readonly spans = createWaterfallController()

  readonly expanded = signal(["checkout"])

  readonly value = signal<string | null>(null)

  readonly rows = computed(() =>
    visibleWaterfallRows(this.trace, this.expanded())
  )
}

export { Example }
