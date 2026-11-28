import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  numberAttribute,
  output,
  type InputSignal,
} from "@angular/core"
import {
  waterfall,
  type WaterfallOptions,
  type WaterfallRowProps,
} from "@ui-sdk/core/waterfall"
import { optionalBoolean, optionalNumber } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"
import { useText } from "./text.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type WaterfallValueChange = Parameters<
  NonNullable<WaterfallOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<WaterfallOptions["onValueChange"]>>[0]
}

/**
 * What `(beforeExpandedChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type WaterfallExpandedChange = Parameters<
  NonNullable<WaterfallOptions["onExpandedChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<WaterfallOptions["onExpandedChange"]>>[0]
}

/**
 * What `(highlight)` emits: the value and what came with it.
 * @experimental
 */
type WaterfallHighlight = Parameters<
  NonNullable<WaterfallOptions["onHighlight"]>
>[1] & {
  /** The value it reports. */
  value: Parameters<NonNullable<WaterfallOptions["onHighlight"]>>[0]
}

/**
 * The row of column headers, above the rows.
 * @experimental
 */
@Directive({
  selector: "[uiWaterfallHeaderRow]",
  exportAs: "uiWaterfallHeaderRow",
})
class WaterfallHeaderRow {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Waterfall).handle, "header-row").state
}

/**
 * A column's header, like "Name" or "Timeline".
 * @experimental
 */
@Directive({
  selector: "[uiWaterfallColumnHeader]",
  exportAs: "uiWaterfallColumnHeader",
})
class WaterfallColumnHeader {
  /** The part's state, as a signal. */
  readonly state = usePart(inject(Waterfall).handle, "column-header").state
}

/**
 * One time on the axis, placed by `--waterfall-tick`. Left empty, it shows the time.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallTick]", exportAs: "uiWaterfallTick" })
class WaterfallTick {
  /** The moment it marks, in milliseconds. */
  readonly time = input.required({ transform: numberAttribute })

  /** The tick's state, as a signal. */
  readonly state = usePart(inject(Waterfall).handle, "tick", () => ({
    time: this.time(),
  })).state

  constructor() {
    useText(() => this.state().label)
  }
}

/**
 * A moment across every row, like DOMContentLoaded, placed by `--waterfall-mark`.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallMark]", exportAs: "uiWaterfallMark" })
class WaterfallMark {
  /** The moment it marks, in milliseconds. */
  readonly time = input.required({ transform: numberAttribute })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Waterfall).handle, "mark", () => ({
    time: this.time(),
  })).state
}

/**
 * One span's row. Its `--waterfall-start` and `--waterfall-size` place the span's bar.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallRow]", exportAs: "uiWaterfallRow" })
class WaterfallRow {
  /** The value of the span the row shows. */
  readonly value = input.required<WaterfallRowProps["value"]>()

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Waterfall).handle, "row", () => ({
    value: this.value(),
  })).state
}

/**
 * The cell that names the span. Put the indicator and the span's label in it.
 * @experimental
 */
@Directive({
  selector: "[uiWaterfallRowHeader]",
  exportAs: "uiWaterfallRowHeader",
})
class WaterfallRowHeader {
  readonly #row = inject(WaterfallRow)

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Waterfall).handle, "row-header", () => ({
    value: this.#row.value(),
  })).state
}

/**
 * The arrow that expands and collapses a span with children.
 * @experimental
 */
@Directive({
  selector: "[uiWaterfallIndicator]",
  exportAs: "uiWaterfallIndicator",
})
class WaterfallIndicator {
  readonly #row = inject(WaterfallRow)

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Waterfall).handle, "indicator", () => ({
    value: this.#row.value(),
  })).state
}

/**
 * A cell of your own, like a status or a size.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallCell]", exportAs: "uiWaterfallCell" })
class WaterfallCell {
  readonly #row = inject(WaterfallRow)

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Waterfall).handle, "cell", () => ({
    value: this.#row.value(),
  })).state
}

/**
 * The cell on the time axis, which screen readers hear as the span's start and duration.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallBar]", exportAs: "uiWaterfallBar" })
class WaterfallBar {
  readonly #row = inject(WaterfallRow)

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Waterfall).handle, "bar", () => ({
    value: this.#row.value(),
  })).state
}

/**
 * The ruler of round times above the bars, hidden from screen readers. Left empty, it renders its ticks.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiWaterfallAxis]",
  exportAs: "uiWaterfallAxis",
  imports: [WaterfallTick],
  template: `
    <ng-content>
      @for (tick of state().ticks; track tick.time) {
        <span uiWaterfallTick [time]="tick.time"></span>
      }
    </ng-content>
  `,
})
class WaterfallAxis {
  /** The most ticks the axis shows. Ticks fall on round times, so it may show fewer. */
  readonly maxTicks = input(undefined, { transform: optionalNumber })

  /** The axis's state, as a signal. Its `ticks` are the round times it shows. */
  readonly state = usePart(inject(Waterfall).handle, "axis", () => ({
    maxTicks: this.maxTicks(),
  })).state
}

/**
 * A trace's spans on a shared time axis, as a tree of rows you expand and collapse, with one tab stop. Left empty, it renders a row for every span.
 * @experimental
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiWaterfall]",
  exportAs: "uiWaterfall",
  imports: [WaterfallBar, WaterfallIndicator, WaterfallRow, WaterfallRowHeader],
  template: `
    <ng-content>
      @for (span of spans(); track span.value) {
        <div uiWaterfallRow [value]="span.value">
          <div uiWaterfallRowHeader>
            @if (span.children) {
              <span uiWaterfallIndicator></span>
            }
            {{ span.label }}
          </div>
          <div uiWaterfallBar></div>
        </div>
      }
    </ng-content>
  `,
})
class Waterfall {
  /** Logs every state change with its reason. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The spans, each with a `value`, a `label`, a `start`, a `duration` and the spans it started as `children`. */
  readonly items = input.required<WaterfallOptions["items"]>()
  /** The stretch of time the axis shows, as `[start, end]` in milliseconds. Bars outside it shrink to its edges. Change it to zoom or pan. */
  readonly range: InputSignal<WaterfallOptions["range"]> = input()
  /** The selected span's value. Bind it with `[(value)]` to control the selection. `null` selects nothing. */
  readonly value: InputSignal<WaterfallOptions["value"]> = input()
  /** The span selected at first, when uncontrolled. */
  readonly defaultValue: InputSignal<WaterfallOptions["defaultValue"]> = input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<WaterfallValueChange["value"]>()
  /** Runs when the selection wants to change. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeValueChange = output<WaterfallValueChange>()
  /** The expanded spans' values. Bind it with `[(expanded)]` to control which spans show their children. */
  readonly expanded: InputSignal<WaterfallOptions["expanded"]> = input()
  /** The spans expanded at first, when uncontrolled. */
  readonly defaultExpanded: InputSignal<WaterfallOptions["defaultExpanded"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly expandedChange = output<WaterfallExpandedChange["value"]>()
  /** Runs when spans want to expand or collapse. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeExpandedChange = output<WaterfallExpandedChange>()
  /** Runs when the keyboard moves focus to a row, with its place among the rows that show, from 0. */
  readonly highlight = output<WaterfallHighlight>()
  /** How times read on the axis and to screen readers: `Intl.NumberFormat` options for a number of milliseconds, or a function of it. */
  readonly format: InputSignal<WaterfallOptions["format"]> = input()
  /** The locale times are formatted in. Defaults to the page's `lang`, or the browser's language without one. */
  readonly locale: InputSignal<WaterfallOptions["locale"]> = input()
  /** What screen readers hear for a span's bar. Set it in the page's language. */
  readonly getBarLabel: InputSignal<WaterfallOptions["getBarLabel"]> = input()
  /** Drives the waterfall from anywhere. Create one with `createWaterfallController()`. */
  readonly controller: InputSignal<WaterfallOptions["controller"]> = input()

  readonly handle = usePrimitive(waterfall, () => ({
    debug: this.debug(),
    items: this.items(),
    range: this.range(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    expanded: this.expanded(),
    defaultExpanded: this.defaultExpanded(),
    onExpandedChange: emitChange(
      this.beforeExpandedChange,
      this.expandedChange
    ),
    onHighlight: (value, details) => this.highlight.emit({ ...details, value }),
    format: this.format(),
    locale: this.locale(),
    getBarLabel: this.getBarLabel(),
    controller: this.controller(),
  }))
  /** The waterfall's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
  // Core reads the spans from `items`, so they're read again when it changes.
  protected readonly spans = computed(() => {
    this.items()
    return this.handle.api.internal.all()
  })
}

export {
  createWaterfallController,
  visibleWaterfallRows,
} from "@ui-sdk/core/waterfall"
export type {
  ListHighlightDetails,
  NumberFormat,
  WaterfallApi,
  WaterfallAxisProps,
  WaterfallAxisState,
  WaterfallBarLabelDetails,
  WaterfallChangeOptions,
  WaterfallController,
  WaterfallData,
  WaterfallDataItem,
  WaterfallDataRow,
  WaterfallExpandedChangeReason,
  WaterfallOptions,
  WaterfallPrimitive,
  WaterfallRowPartProps,
  WaterfallRowProps,
  WaterfallRowState,
  WaterfallState,
  WaterfallTickData,
  WaterfallTimeProps,
  WaterfallTimeState,
  WaterfallValueChangeReason,
} from "@ui-sdk/core/waterfall"

export {
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallCell,
  WaterfallColumnHeader,
  type WaterfallExpandedChange,
  WaterfallHeaderRow,
  type WaterfallHighlight,
  WaterfallIndicator,
  WaterfallMark,
  WaterfallRow,
  WaterfallRowHeader,
  WaterfallTick,
  type WaterfallValueChange,
}
