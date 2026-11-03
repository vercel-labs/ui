import * as React from "react"
import {
  addMonths,
  addYears,
  daysInMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "@ui-sdk/core/date"

function Example() {
  const [date, setDate] = React.useState("2026-01-31")
  const [weekStartsOn, setWeekStartsOn] = React.useState(1)
  const [year, month] = date.split("-").map(Number)
  const week = { start: startOfWeek(date, weekStartsOn), end: endOfWeek(date, weekStartsOn) }
  const steps: [string, string, () => string][] = [
    ["month-back", "− Month", () => addMonths(date, -1)],
    ["month", "+ Month", () => addMonths(date, 1)],
    ["year", "+ Year", () => addYears(date, 1)],
  ]
  return (
    <div data-slot="stack">
      <p data-date data-slot="date-value">
        {date}
      </p>
      <div data-slot="row">
        {steps.map(([value, text, next]) => (
          <button key={value} type="button" data-size="sm" onClick={() => setDate(next())}>
            {text}
          </button>
        ))}
        <button type="button" data-size="sm" onClick={() => setDate("2026-01-31")}>
          Reset
        </button>
      </div>
      <label data-slot="label">
        Weeks start on
        <select value={weekStartsOn} onChange={(event) => setWeekStartsOn(Number(event.target.value))}>
          <option value={0}>Sunday</option>
          <option value={1}>Monday</option>
          <option value={6}>Saturday</option>
        </select>
      </label>
      <dl>
        <dt>Week</dt>
        <dd data-this-week>
          {week.start} to {week.end}
          {!isSameMonth(week.start, week.end) && ", across two months"}
        </dd>
        <dt>Month</dt>
        <dd data-this-month>
          {startOfMonth(date)} to {endOfMonth(date)}, {daysInMonth(year, month)} days
        </dd>
      </dl>
    </div>
  )
}

export { Example }
