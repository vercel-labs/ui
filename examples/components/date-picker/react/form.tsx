"use client"

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

function Example() {
  const [submitted, setSubmitted] = React.useState("")
  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(new FormData(event.currentTarget).get("due") as string)
      }}
    >
      <DatePicker name="due" required>
        <div data-slot="row">
          <DatePickerInput aria-label="Due date" />
          <DatePickerTrigger data-variant="ghost">
            <CalendarIcon aria-hidden="true" />
          </DatePickerTrigger>
        </div>
        <DatePickerHint />
        <DatePickerContent>
          <div data-slot="row">
            <CalendarPrevious data-variant="ghost">
              <ChevronLeftIcon aria-hidden="true" />
            </CalendarPrevious>
            <CalendarHeading />
            <CalendarNext data-variant="ghost">
              <ChevronRightIcon aria-hidden="true" />
            </CalendarNext>
          </div>
          <CalendarGrid>
            <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
            <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
          </CalendarGrid>
        </DatePickerContent>
      </DatePicker>
      <button type="submit">Submit</button>
      <p data-slot="hint">Submitted: {submitted || "nothing yet"}</p>
    </form>
  )
}

export { Example }
