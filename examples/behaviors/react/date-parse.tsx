import * as React from "react"
import { datePattern, formatDate, parseDate } from "@ui-sdk/core/date"

const locales = [
  ["en-US", "English (US)"],
  ["de-DE", "Deutsch"],
  ["fr-FR", "Français"],
  ["ar-EG", "العربية"],
]

function Example() {
  const [locale, setLocale] = React.useState("en-US")
  const [text, setText] = React.useState("10/16/26")
  const [reference, setReference] = React.useState("2026-10-16")
  const pattern = datePattern(locale)
  const date = parseDate(text, locale, { referenceDate: reference })
  return (
    <div data-slot="stack">
      <div data-slot="date-field-group">
        <select aria-label="Locale" value={locale} onChange={(event) => setLocale(event.target.value)}>
          {locales.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="date"
          aria-label="Reference date"
          value={reference}
          onChange={(event) => setReference(event.target.value || "2026-10-16")}
        />
      </div>
      <input
        aria-label="Date"
        aria-description={`Like ${pattern.example}`}
        placeholder={pattern.placeholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <p data-parsed>
        {date ? `${date}, ${formatDate(date, locale)}` : `Type a date, like ${pattern.example}`}
      </p>
      <p data-pattern data-slot="hint">
        {pattern.fields.join(` ${pattern.separator} `)}
      </p>
    </div>
  )
}

export { Example }
