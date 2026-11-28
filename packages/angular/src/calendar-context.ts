import {
  Directive,
  effect,
  inject,
  InjectionToken,
  input,
  type Signal,
  type TemplateRef,
  ViewContainerRef,
} from "@angular/core"
import type { calendar, CalendarGridState } from "@ui-sdk/core/calendar"
import { usePart, type PrimitiveHandle } from "./use-primitive.ts"

// The calendar the parts render: a Calendar, or the one inside a Date Picker,
// whose primitive has the same parts.
const CalendarContext = new InjectionToken<PrimitiveHandle<typeof calendar>>(
  "uiCalendar"
)

// A grid's offset and state, for the rows and days inside it.
const CalendarGridContext = new InjectionToken<{
  offset: () => number
  state: Signal<CalendarGridState>
}>("uiCalendarGrid")

// The offsets of the months shown, from 0, for a grid each. At least one.
function monthOffsets(months: number | undefined) {
  return Array.from(
    { length: Math.max(1, Math.floor(months ?? 1) || 1) },
    (_, offset) => offset
  )
}

// The row of weekday names, which CalendarWeekdays renders.
@Directive({ selector: "[uiCalendarWeekdaysRow]" })
class CalendarWeekdaysRow {
  constructor() {
    const grid = inject(CalendarGridContext)
    usePart(inject(CalendarContext), "weekdays", () => ({
      id: String(grid.offset()),
    }))
  }
}

// A week's row, which CalendarWeeks renders one of per week.
@Directive({ selector: "[uiCalendarWeek]" })
class CalendarWeek {
  readonly index = input.required<number>()

  constructor() {
    const grid = inject(CalendarGridContext)
    usePart(inject(CalendarContext), "week", () => ({
      id: `${grid.offset()}-${this.index()}`,
    }))
  }
}

// Renders an author's template for one cell, like a day's from its date.
@Directive({ selector: "[uiCalendarCell]" })
class CalendarCell<Value> {
  readonly uiCalendarCell = input.required<TemplateRef<unknown>>()
  readonly value = input.required<Value>()

  constructor() {
    const container = inject(ViewContainerRef)
    effect(() => {
      container.clear()
      container.createEmbeddedView(this.uiCalendarCell(), {
        $implicit: this.value(),
      })
    })
  }
}

export {
  CalendarCell,
  CalendarContext,
  CalendarGridContext,
  CalendarWeek,
  CalendarWeekdaysRow,
  monthOffsets,
}
