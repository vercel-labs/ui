import {
  Component,
  ElementRef,
  computed,
  signal,
  viewChild,
} from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  visibleWaterfallRows,
  Waterfall,
  WaterfallBar,
  WaterfallIndicator,
  WaterfallRow,
  WaterfallRowHeader,
  type WaterfallData,
} from "@ui-sdk/angular/waterfall"

@Component({
  imports: [
    Waterfall,
    WaterfallBar,
    WaterfallIndicator,
    WaterfallRow,
    WaterfallRowHeader,
    LucideChevronRight,
  ],
  template: `
    <div
      data-slot="scroll"
      #scroller
      (scroll)="scrollTop.set(scroller.scrollTop)"
    >
      <div
        uiWaterfall
        aria-label="Build trace"
        [attr.aria-rowcount]="rows().length"
        [items]="trace"
        [range]="[0, 400]"
        [(expanded)]="expanded"
        (highlight)="onHighlight($event.value, $event)"
        style="height: {{ rows().length * row }}px"
      >
        @for (entry of rows().slice(start(), end()); track entry.item.value) {
          <div
            uiWaterfallRow
            [value]="entry.item.value"
            [attr.aria-rowindex]="entry.index + 1"
            style="top: {{ entry.index * row }}px"
          >
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
  readonly trace: WaterfallData = Array.from({ length: 2000 }, (_, job) => ({
    value: `job-${job + 1}`,
    label: `job ${job + 1}`,
    start: job * 4,
    duration: 60,
    children: Array.from({ length: 4 }, (_, step) => ({
      value: `job-${job + 1}/step-${step + 1}`,
      label: `step ${step + 1}`,
      start: job * 4 + step * 15,
      duration: 15,
    })),
  }))

  readonly row = 32

  readonly height = 288

  readonly scroller = viewChild<ElementRef<HTMLDivElement>>("scroller")

  readonly scrollTop = signal(0)

  readonly expanded = signal(["job-1"])

  readonly rows = computed(() =>
    visibleWaterfallRows(this.trace, this.expanded())
  )

  readonly start = computed(() =>
    Math.max(0, Math.floor(this.scrollTop() / this.row) - 4)
  )

  readonly end = computed(() =>
    Math.min(
      this.rows().length,
      Math.ceil((this.scrollTop() + this.height) / this.row) + 4
    )
  )

  onHighlight(_value: string, { index }: { index: number }) {
    const el = this.scroller()?.nativeElement
    if (!el) {
      return
    }
    const top = index * this.row
    if (top < el.scrollTop) {
      el.scrollTop = top
    } else if (top + this.row > el.scrollTop + el.clientHeight) {
      el.scrollTop = top + this.row - el.clientHeight
    }
    this.scrollTop.set(el.scrollTop)
  }
}

export { Example }
