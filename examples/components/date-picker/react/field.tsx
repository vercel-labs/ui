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
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"

function Example() {
  return (
    <Field>
      <FieldLabel>Due date</FieldLabel>
      <DatePicker defaultValue="2026-10-16">
        <div data-slot="row">
          <DatePickerInput />
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
          <CalendarGrid>
            <CalendarWeekdays>{(index) => <CalendarWeekday index={index} />}</CalendarWeekdays>
            <CalendarWeeks>{(cell) => <CalendarDay value={cell.date} />}</CalendarWeeks>
          </CalendarGrid>
        </DatePickerContent>
      </DatePicker>
      <FieldDescription>When the invoice is due.</FieldDescription>
    </Field>
  )
}

export { Example }
