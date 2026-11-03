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
  DatePickerInput,
  DatePickerTrigger,
} from "@ui-sdk/react/date-picker"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import * as React from "react"

function Example() {
  const [submitted, setSubmitted] = React.useState("")
  return (
    <div data-slot="stack">
      <DatePicker
        mode="range"
        months={2}
        pageBy="page"
        minDays={2}
        maxDays={14}
        unavailable={["2026-10-24"]}
        allowUnavailable
        startName="checkin"
        endName="checkout"
        form="booking"
        defaultMonth="2026-10"
      >
        <div data-slot="row">
          <DatePickerInput aria-label="Check in" />
          <span data-slot="hint">–</span>
          <DatePickerInput end aria-label="Check out" />
          <DatePickerTrigger data-variant="ghost">
            <CalendarIcon aria-hidden="true" />
          </DatePickerTrigger>
        </div>
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
          <div data-slot="stack">
            <CalendarGrid>
              <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
              <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
            </CalendarGrid>
            <CalendarGrid offset={1}>
              <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
              <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
            </CalendarGrid>
          </div>
        </DatePickerContent>
      </DatePicker>
      <form
        id="booking"
        onSubmit={(event) => {
          event.preventDefault()
          const data = [...new FormData(event.currentTarget)].map(([name, value]) => `${name}=${value}`)
          setSubmitted(data.join("&"))
        }}
      >
        <button type="submit">Book</button>
      </form>
      <p data-slot="hint">{submitted || "Ranges include 2 to 14 days, and may cross the booked 24th."}</p>
    </div>
  )
}

export { Example }
