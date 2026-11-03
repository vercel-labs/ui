import * as React from "react"
import { dateParts, isISODate, isoDate, toISODate } from "@ui-sdk/core/date"

function Example() {
  const [fields, setFields] = React.useState({ year: "2026", month: "2", day: "30" })
  const [picked, setPicked] = React.useState("2026-10-16")
  const built = isoDate(Number(fields.year), Number(fields.month), Number(fields.day))
  const parts = dateParts(picked)
  return (
    <div data-slot="stack">
      <div data-slot="stack">
        <div data-slot="date-field-group">
          {(["year", "month", "day"] as const).map((field) => (
            <label key={field} data-slot="label">
              {field[0].toUpperCase() + field.slice(1)}
              <input
                inputMode="numeric"
                value={fields[field]}
                onChange={(event) => setFields({ ...fields, [field]: event.target.value })}
              />
            </label>
          ))}
        </div>
        <p data-built data-slot="date-value">
          {built ?? "No such day"}
        </p>
      </div>
      <div data-slot="stack">
        <div data-slot="date-field-group">
          <input
            type="date"
            aria-label="Picked date"
            value={picked}
            onChange={(event) => setPicked(event.target.value)}
          />
          <button type="button" onClick={() => setPicked(toISODate(new Date())!)}>
            Today
          </button>
        </div>
        <p data-parts data-slot="date-value">
          {isISODate(picked) && parts
            ? `year ${parts.year}, month ${parts.month}, day ${parts.day}`
            : "Pick a date"}
        </p>
      </div>
    </div>
  )
}

export { Example }
