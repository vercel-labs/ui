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
  DatePickerContent,
  DatePickerInput,
  DatePicker as DatePickerPrimitive,
  DatePickerTrigger,
} from "@ui-sdk/react/date-picker"
import { cn } from "cn"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import type { ComponentProps } from "react"

const iconButton =
  "inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl outline-none select-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4"

function DatePicker({
  className,
  ...props
}: Omit<ComponentProps<typeof DatePickerPrimitive>, "className" | "children"> & { className?: string }) {
  return (
    <DatePickerPrimitive className={cn("flex text-sm", className)} {...props}>
      <div className="flex h-8 w-full items-center gap-0.5 rounded-2xl border border-transparent bg-input/50 ps-2.5 pe-1 transition-[color,box-shadow] duration-200 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/30 motion-reduce:transition-none">
        <DatePickerInput className="h-full w-full min-w-0 bg-transparent text-base tabular-nums outline-none placeholder:text-muted-foreground md:text-sm" />
        <DatePickerTrigger className={cn(iconButton, "size-6 rounded-xl text-muted-foreground")}>
          <CalendarIcon aria-hidden="true" />
        </DatePickerTrigger>
      </div>
      <DatePickerContent className="max-h-(--available-height) origin-(--transform-origin) overflow-y-auto rounded-3xl bg-popover p-3 text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10">
        <div className="flex items-center justify-between gap-2 pb-2">
          <CalendarPrevious className={iconButton}>
            <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
          </CalendarPrevious>
          <CalendarHeading className="text-sm font-medium" />
          <CalendarNext className={iconButton}>
            <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
          </CalendarNext>
        </div>
        <CalendarGrid className="border-collapse">
          <CalendarWeekdays>
            {(index) => (
              <CalendarWeekday
                index={index}
                className="size-8 text-center text-[0.8rem] font-normal text-muted-foreground"
              />
            )}
          </CalendarWeekdays>
          <CalendarWeeks>
            {(cell) => (
              <CalendarDay
                value={cell.date}
                className="size-8 cursor-default rounded-2xl text-center outline-none select-none transition-colors hover:bg-muted focus-visible:relative focus-visible:ring-3 focus-visible:ring-ring/30 data-today:bg-muted data-today:font-medium data-outside:text-muted-foreground data-disabled:opacity-50 data-selected:bg-primary data-selected:text-primary-foreground motion-reduce:transition-none"
              />
            )}
          </CalendarWeeks>
        </CalendarGrid>
      </DatePickerContent>
    </DatePickerPrimitive>
  )
}

export { DatePicker }
