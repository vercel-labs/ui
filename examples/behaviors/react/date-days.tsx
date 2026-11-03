import * as React from "react"
import { addDays, clampDate, daysBetween, formatDate, weekday } from "@ui-sdk/core/date"

const season = { min: "2026-11-01", max: "2027-01-31" }
const today = "2026-10-16"
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function Example() {
  const [picked, setPicked] = React.useState("2026-12-24")
  const [nights, setNights] = React.useState(3)
  const checkIn = clampDate(picked || today, season.min, season.max)
  const checkOut = addDays(checkIn, nights)
  return (
    <div data-slot="stack">
      <div data-slot="date-field-group">
        <label data-slot="label">
          Check-in
          <input type="date" value={picked} onChange={(event) => setPicked(event.target.value)} />
        </label>
        <label data-slot="label">
          Nights
          <input
            type="number"
            min={1}
            max={14}
            value={nights}
            onChange={(event) => setNights(Number(event.target.value) || 1)}
          />
        </label>
      </div>
      <dl>
        <dt>Check-in</dt>
        <dd data-check-in>
          {days[weekday(checkIn)]}, {checkIn}
          {checkIn !== picked && " (moved into the season)"}
        </dd>
        <dt>Check-out</dt>
        <dd data-check-out>
          {days[weekday(checkOut)]}, {checkOut}
        </dd>
        <dt>From today</dt>
        <dd data-away>
          {daysBetween(today, checkIn)} days after{" "}
          {formatDate(today, "en-US", { month: "short", day: "numeric" })}
        </dd>
      </dl>
    </div>
  )
}

export { Example }
