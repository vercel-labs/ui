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
} from "@ui-sdk/react/calendar"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [value, setValue] = React.useState<CalendarValue>("2026-10-16")
  const [month, setMonth] = React.useState("2026-10")
  const [reason, setReason] = React.useState("")
  return (
    <div>
      <Calendar
        value={value}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        month={month}
        onMonthChange={(next, details) => {
          setMonth(next)
          setReason(details.reason)
        }}
      >
        <div data-slot="row">
          <CalendarPrevious data-variant="ghost">
            <ChevronLeftIcon />
          </CalendarPrevious>
          <CalendarHeading />
          <CalendarNext data-variant="ghost">
            <ChevronRightIcon />
          </CalendarNext>
        </div>
        <CalendarGrid>
          <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
          <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
        </CalendarGrid>
      </Calendar>
      <output data-slot="output">
        {String(value)}, showing {month} {reason && `(${reason})`}
      </output>
    </div>
  )
}
