import * as React from "react"
import { formatNumber, isPartialNumber, parseNumber } from "@ui-sdk/core/number"

const locales = ["en-US", "de-DE", "fr-FR", "ar-EG"]

function Example() {
  const [locale, setLocale] = React.useState("de-DE")
  const [text, setText] = React.useState("1.234,5")
  const value = parseNumber(text, locale)
  const typing = value === null && isPartialNumber(text, locale)
  return (
    <div>
      <div>
        <select aria-label="Locale" value={locale} onChange={(event) => setLocale(event.target.value)}>
          {locales.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <input
          aria-label="Amount"
          inputMode="decimal"
          value={text}
          aria-invalid={value === null && !typing}
          onChange={(event) => setText(event.target.value)}
        />
      </div>
      <p data-parsed>{value !== null ? String(value) : typing ? "Keep typing" : "Not a number"}</p>
      <p>Try {formatNumber(9876.5, locale)} in this locale.</p>
    </div>
  )
}

export { Example }
