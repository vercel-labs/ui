import * as React from "react"
import { formatNumber, fractionOf, valueAt } from "@ui-sdk/core/number"

const range = { min: 1, max: 180 }

function Example() {
  const [scale, setScale] = React.useState<"linear" | "log">("log")
  const [angle, setAngle] = React.useState(45)
  const position = fractionOf(angle, range, scale)
  const degrees = `${formatNumber(angle, "en-US", { maximumFractionDigits: 0 })}°`
  return (
    <div>
      <div role="radiogroup" aria-label="Scale">
        {(["linear", "log"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={scale === option}
            onClick={() => setScale(option)}
          >
            {option === "log" ? "Log" : "Linear"}
          </button>
        ))}
      </div>
      <div>
        <div data-needle style={{ transform: `translateY(-50%) rotate(${-angle}deg)` }} />
        <div />
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
      />
      <p>
        <span data-angle>{degrees}</span>
        <span data-position>{Math.round(position * 100)}% along</span>
      </p>
    </div>
  )
}

export { Example }
