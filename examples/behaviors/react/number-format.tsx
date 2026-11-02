import * as React from "react"
import { formatNumber, formatNumberRange, formatNumberToParts } from "@ui-sdk/core/number"

const locales = ["en-US", "de-DE", "ja-JP", "zh-CN", "ar-EG", "hi-IN"]
const styles: Record<string, Intl.NumberFormatOptions> = {
  Currency: { style: "currency", currency: "EUR" },
  Percent: { style: "percent", maximumFractionDigits: 1 },
  Compact: { notation: "compact" },
  Unit: { style: "unit", unit: "kilometer-per-hour" },
}
const values: Record<string, [number, number]> = {
  Currency: [1234.5, 2500],
  Percent: [0.256, 0.5],
  Compact: [1234567, 9800000],
  Unit: [88, 120],
}

function Example() {
  const [locale, setLocale] = React.useState("en-US")
  const [style, setStyle] = React.useState("Currency")
  const [value, end] = values[style]
  const format = styles[style]
  return (
    <div className="flex w-80 flex-col gap-3 text-sm">
      <div className="flex gap-2">
        <select
          aria-label="Locale"
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
          className="h-8 flex-1 rounded-md border border-input bg-background px-2"
        >
          {locales.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          aria-label="Style"
          value={style}
          onChange={(event) => setStyle(event.target.value)}
          className="h-8 flex-1 rounded-md border border-input bg-background px-2"
        >
          {Object.keys(styles).map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <p data-formatted className="m-0 text-2xl font-medium">
        {formatNumberToParts(value, locale, format).map((part, index) => (
          <span
            key={index}
            data-type={part.type}
            className="data-[type=fraction]:text-muted-foreground data-[type=currency]:text-muted-foreground"
          >
            {part.value}
          </span>
        ))}
      </p>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Plain</dt>
        <dd data-plain className="m-0 font-mono">
          {formatNumber(value, locale, format)}
        </dd>
        <dt className="text-muted-foreground">Range</dt>
        <dd data-range className="m-0 font-mono">
          {formatNumberRange(value, end, locale, format)}
        </dd>
      </dl>
    </div>
  )
}

export { Example }
