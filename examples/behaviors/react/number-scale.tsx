import * as React from "react"
import { formatNumber, fractionOf, valueAt } from "@ui-sdk/core/number"

const range = { min: 1, max: 180 }

function Example() {
  const [scale, setScale] = React.useState<"linear" | "log">("log")
  const [angle, setAngle] = React.useState(45)
  const position = fractionOf(angle, range, scale)
  const degrees = `${formatNumber(angle, "en-US", { maximumFractionDigits: 0 })}°`
  return (
    <div className="flex w-72 flex-col items-center gap-4 text-sm">
      <div className="flex gap-2" role="radiogroup" aria-label="Scale">
        {(["linear", "log"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={scale === option}
            onClick={() => setScale(option)}
            className="rounded-md border border-border px-2 py-1 text-xs aria-checked:bg-foreground aria-checked:text-background"
          >
            {option === "log" ? "Log" : "Linear"}
          </button>
        ))}
      </div>
      <div className="relative size-28 rounded-full border border-border">
        <div
          data-needle
          className="absolute top-1/2 left-1/2 h-1 w-12 origin-left rounded-full bg-foreground"
          style={{ transform: `translateY(-50%) rotate(${-angle}deg)` }}
        />
        <div className="absolute top-1/2 left-1/2 size-3 -translate-1/2 rounded-full bg-foreground" />
      </div>
      <input
        type="range"
        aria-label="Rotation"
        aria-valuetext={degrees}
        min={0}
        max={1}
        step={0.001}
        value={position}
        onChange={(event) => setAngle(valueAt(Number(event.target.value), range, scale))}
        className="w-full accent-foreground"
      />
      <p className="m-0 flex w-full justify-between font-mono text-xs">
        <span data-angle>{degrees}</span>
        <span data-position className="text-muted-foreground">
          {Math.round(position * 100)}% along
        </span>
      </p>
    </div>
  )
}

export { Example }
