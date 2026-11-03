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
  const [log, setLog] = React.useState("")
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)
  const [container, setContainer] = React.useState<HTMLElement | null>(null)
  return (
    <div data-slot="stack">
      <DatePicker
        defaultOpen={false}
        presentation="auto"
        container={container}
        onOpenChange={(open, details) => setLog(`${open ? "Opened" : "Closed"} (${details.reason})`)}
        onOpenChangeComplete={(open) => open || setLog((log) => `${log}, done`)}
        onMonthChange={(month, details) => setLog(`Showing ${month} (${details.reason})`)}
      >
        <div data-slot="row" ref={setAnchor}>
          <DatePickerInput aria-label="Due date" />
          <DatePickerTrigger data-variant="ghost">
            <CalendarIcon aria-hidden="true" />
          </DatePickerTrigger>
        </div>
        <DatePickerHint />
        <DatePickerContent
          side="top"
          align="end"
          sideOffset={8}
          alignOffset={-4}
          collisionPadding={16}
          anchor={anchor}
          finalFocus="none"
          keepMounted
        >
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
      <div ref={setContainer} />
      <p data-slot="hint">{log || "Opens above, lined up with the end of the field."}</p>
    </div>
  )
}

export { Example }
