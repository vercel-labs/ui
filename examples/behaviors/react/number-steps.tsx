import * as React from "react"
import { formatNumber, parseNumber, scrubTo, stepBy, stepFromKey } from "@ui-sdk/core/number"

const range = { min: 0, max: 20, step: 0.5, largeStep: 5, smallStep: 0.1 }

function Example() {
  const [value, setValue] = React.useState(2.5)
  const [typed, setTyped] = React.useState<string | null>(null)
  const shown = formatNumber(value, "en-US", { maximumFractionDigits: 1 })
  const current = () => {
    const parsed = typed === null ? null : parseNumber(typed, "en-US")
    return parsed === null ? value : scrubTo(parsed, range).value
  }
  const commit = () => {
    setValue(current())
    setTyped(null)
  }
  return (
    <div className="flex w-72 flex-col gap-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="quantity" className="text-muted-foreground">
          Quantity in kg
        </label>
        <input
          id="quantity"
          role="spinbutton"
          inputMode="decimal"
          autoComplete="off"
          aria-valuemin={range.min}
          aria-valuemax={range.max}
          aria-valuenow={value}
          aria-valuetext={`${shown} kg`}
          value={typed ?? shown}
          onChange={(event) => setTyped(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") return commit()
            const move = stepFromKey(event, { arrows: "vertical" })
            if (!move) return
            event.preventDefault()
            setValue(stepBy(current(), move, range))
            setTyped(null)
          }}
          className="h-9 w-24 rounded-md border border-input bg-background px-3 text-right font-mono tabular-nums outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <p className="m-0 text-xs text-muted-foreground">
        Arrows step by 0.5, Shift by 5, Alt by 0.1. Home and End go to 0 and 20. Typed weights snap to 0.5.
      </p>
    </div>
  )
}

export { Example }
