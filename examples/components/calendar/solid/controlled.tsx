import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  type CalendarValue,
} from "@ui-sdk/solid/calendar"
import { createSignal } from "solid-js"

export function Example() {
  const [value, setValue] = createSignal<CalendarValue>("2026-10-16")
  const [month, setMonth] = createSignal("2026-10")
  const [reason, setReason] = createSignal("")
  return (
    <div>
      <Calendar
        value={value()}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        month={month()}
        onMonthChange={(next, details) => {
          setMonth(next)
          setReason(details.reason)
        }}
      >
        <div data-slot="row">
          <CalendarPrevious data-variant="ghost">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </CalendarPrevious>
          <CalendarHeading />
          <CalendarNext data-variant="ghost">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </CalendarNext>
        </div>
        <CalendarGrid>
          <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
          <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
        </CalendarGrid>
      </Calendar>
      <output data-slot="output">
        {String(value())}, showing {month()} {reason() && `(${reason()})`}
      </output>
    </div>
  )
}
