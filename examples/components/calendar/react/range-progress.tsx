"use client"

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
} from "@ui-sdk/react/calendar"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import * as React from "react"

function Example() {
  const [range, setRange] = React.useState<{ anchor: string | null; focused: string | null }>({
    anchor: null,
    focused: null,
  })
  return (
    <div>
      <Calendar
        mode="range"
        onAnchorChange={(anchor) => setRange((current) => ({ ...current, anchor }))}
        onFocusedChange={(focused) => setRange((current) => ({ ...current, focused }))}
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
      </Calendar>
      <output data-slot="output">
        {range.anchor
          ? `Started on ${range.anchor}, focus on ${range.focused}`
          : `Focus on ${range.focused ?? "no date yet"}`}
      </output>
    </div>
  )
}

export { Example }
