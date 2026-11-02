import * as React from "react"
import { formatNumber, fractionOf, scrubTo, stepBy, stepFromKey } from "@ui-sdk/core/number"

const sections = [
  { at: 0, label: "Intro" },
  { at: 9.5, label: "Verse" },
  { at: 24, label: "Chorus" },
  { at: 38.5, label: "Bridge" },
  { at: 52, label: "Outro" },
]

const range = {
  min: 0,
  max: 60,
  step: 0.1,
  largeStep: 5,
  snap: { points: sections.map((section) => section.at), threshold: 1.5 },
}

const clock = (time: number) =>
  `${Math.floor(time / 60)}:${formatNumber(time % 60, "en-US", {
    minimumIntegerDigits: 2,
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}`

function Example() {
  const [time, setTime] = React.useState(17)
  const free = React.useRef(false)
  const section = sections.find((candidate) => candidate.at === time)
  const track = (event: React.PointerEvent) => {
    free.current = event.metaKey || event.ctrlKey
  }
  return (
    <div className="flex w-80 flex-col gap-3 text-sm">
      <div className="relative h-14 rounded-lg bg-muted">
        {sections.map((candidate) => (
          <div
            key={candidate.label}
            data-active={candidate === section || undefined}
            className="absolute inset-y-0 flex flex-col items-start border-l border-border pt-1 pl-1 text-[10px] text-muted-foreground data-active:border-foreground data-active:text-foreground"
            style={{ left: `${fractionOf(candidate.at, range) * 100}%` }}
          >
            {candidate.label}
          </div>
        ))}
        <div
          data-playhead
          className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-foreground"
          style={{ left: `${fractionOf(time, range) * 100}%` }}
        >
          <div className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-foreground" />
        </div>
      </div>
      <input
        type="range"
        aria-label="Playhead"
        aria-valuetext={section ? `${clock(time)}, ${section.label}` : clock(time)}
        min={range.min}
        max={range.max}
        step={range.step}
        value={time}
        onPointerDown={track}
        onPointerMove={track}
        onChange={(event) =>
          setTime(scrubTo(Number(event.target.value), range, { snap: !free.current }).value)
        }
        onKeyDown={(event) => {
          const move = stepFromKey(event)
          if (!move) return
          event.preventDefault()
          setTime(stepBy(time, move, range, { snap: !(event.metaKey || event.ctrlKey) }))
        }}
        className="w-full accent-foreground"
      />
      <p className="m-0 flex justify-between font-mono text-xs">
        <span data-time>{clock(time)}</span>
        <span data-section className="text-muted-foreground">
          {section?.label ?? "Between sections"}
        </span>
      </p>
      <p className="m-0 text-xs text-muted-foreground">Hold ⌘ or Ctrl to scrub freely.</p>
    </div>
  )
}

export { Example }
