import * as React from "react"
import { formatNumber, isPartialNumber, parseNumber } from "@ui-sdk/core/number"

const locales = ["en-US", "de-DE", "fr-FR", "ar-EG"]

function Example() {
  const [locale, setLocale] = React.useState("de-DE")
  const [text, setText] = React.useState("1.234,5")
  const value = parseNumber(text, locale)
  const typing = value === null && isPartialNumber(text, locale)
  return (
    <div className="flex w-72 flex-col gap-3 text-sm">
      <div className="flex gap-2">
        <select
          aria-label="Locale"
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
          className="h-8 w-24 rounded-md border border-input bg-background px-2"
        >
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
          className="h-8 flex-1 rounded-md border border-input bg-background px-2 aria-invalid:border-destructive"
        />
      </div>
      <p data-parsed className="m-0 font-mono text-xs">
        {value !== null ? String(value) : typing ? "Keep typing" : "Not a number"}
      </p>
      <p className="m-0 text-xs text-muted-foreground">Try {formatNumber(9876.5, locale)} in this locale.</p>
    </div>
  )
}

export { Example }
