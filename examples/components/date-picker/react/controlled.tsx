import {
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@ui-sdk/react/date-picker"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import * as React from "react"
import type { DatePickerValue } from "@ui-sdk/react/date-picker"

export function Example() {
  const [value, setValue] = React.useState<DatePickerValue>("2026-10-16")
  const [reason, setReason] = React.useState("initial")
  return (
    <DatePicker
      value={value}
      onValueChange={(next, details) => {
        setValue(next)
        setReason(details.reason)
      }}
    >
      <div data-slot="row">
        <DatePickerInput aria-label="Due date" />
        <DatePickerTrigger>
          <CalendarIcon />
        </DatePickerTrigger>
      </div>
      <DatePickerHint />
      <DatePickerContent>
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
      </DatePickerContent>
      <p data-slot="hint">
        {value ?? "No date"} ({reason})
      </p>
    </DatePicker>
  )
}
