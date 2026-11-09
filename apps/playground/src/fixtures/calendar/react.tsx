import {
  Calendar,
  CalendarGrid,
  CalendarHeading,
  CalendarMonthSelect,
  CalendarNext,
  CalendarPrevious,
  CalendarYearSelect,
  createCalendarController,
  type CalendarValue,
} from "@ui-sdk/react/calendar"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  calendarAction,
  calendarFixture,
  calendarOptions,
} from "tests/fixtures/calendar.ts"

const controller = createCalendarController()

function Fixture() {
  const { controlled, selects, lang, defaultValue, defaultMonth, ...options } =
    calendarOptions()
  const [action, setAction] = React.useState("")
  const [value, setValue] = React.useState<CalendarValue>(defaultValue)
  const [month, setMonth] = React.useState(
    defaultMonth ?? calendarFixture.today.slice(0, 7)
  )
  const f = calendarFixture
  return (
    <div className="fixture" lang={lang}>
      <button>Before</button>
      <Calendar
        className="calendar"
        today={f.today}
        controller={controller}
        {...options}
        {...(controlled ? { value, month } : { defaultValue, defaultMonth })}
        onValueChange={(next, details) => {
          setValue(next)
          setAction(calendarAction("value", next, details.reason))
        }}
        onMonthChange={(next, details) => {
          setMonth(next)
          setAction(calendarAction("month", next, details.reason))
        }}
      >
        <div className="calendar-header">
          <CalendarPrevious className="calendar-step" />
          <CalendarHeading className="calendar-heading" />
          {selects && (
            <>
              <CalendarMonthSelect />
              <CalendarYearSelect />
            </>
          )}
          <CalendarNext className="calendar-step" />
        </div>
        <div className="calendar-months">
          {Array.from({ length: options.months ?? 1 }, (_, offset) => (
            <CalendarGrid
              key={offset}
              offset={offset}
              className="calendar-grid"
            />
          ))}
        </div>
      </Calendar>
      <button onClick={() => controller.focus(f.controller.date)}>
        {f.controller.label}
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
