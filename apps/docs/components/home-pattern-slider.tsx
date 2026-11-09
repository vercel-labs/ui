"use client"

import * as React from "react"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/react/slider"

// Temporary: lets the team pick how strong the poster patterns are. Delete
// this file and its use in app/page.tsx once a level is chosen.

const storageKey = "ui-sdk:pattern-intensity"

const stops = [
  { label: "Off", value: 0 },
  { label: "25", value: 25 },
  { label: "Half", value: 50 },
  { label: "75", value: 75 },
  { label: "Full", value: 100 },
]

function snap(value: number) {
  if (!Number.isFinite(value)) {
    return 100
  }
  return Math.min(100, Math.max(0, Math.round(value / 25) * 25))
}

function labelOf(value: number) {
  return stops.find((stop) => stop.value === value)?.label ?? `${value}%`
}

function apply(value: number) {
  document.documentElement.style.setProperty(
    "--pattern-opacity",
    String(value / 100)
  )
  try {
    localStorage.setItem(storageKey, String(value))
  } catch {}
}

function PatternSlider() {
  const [value, setValue] = React.useState(100)

  React.useEffect(() => {
    let stored = 100
    try {
      stored = snap(Number(localStorage.getItem(storageKey) ?? 100))
    } catch {}
    setValue(stored)
    apply(stored)
    return () => {
      document.documentElement.style.removeProperty("--pattern-opacity")
    }
  }, [])

  function change(next: number) {
    setValue(next)
    apply(next)
  }

  return (
    <Slider
      value={value}
      onValueChange={change}
      min={0}
      max={100}
      step={25}
      format={labelOf}
      className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-64 flex-col gap-3 border border-foreground bg-background p-4 font-mono text-[11px] leading-4 tracking-[0.06em] uppercase"
    >
      <span aria-hidden="true">Patterns</span>
      <SliderControl className="flex h-6 items-center">
        <SliderTrack className="relative h-px w-full bg-foreground/25">
          <SliderIndicator className="h-0.5 -translate-y-[0.5px] bg-foreground" />
          <SliderThumb
            aria-label="Patterns"
            className="size-4 border border-foreground bg-background outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006bff] focus-visible:outline-solid has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#006bff] has-focus-visible:outline-solid data-dragging:bg-foreground"
          />
        </SliderTrack>
      </SliderControl>
      <div aria-hidden="true" className="flex justify-between">
        {stops.map((stop) => (
          <span
            key={stop.value}
            data-active={stop.value === value ? "" : undefined}
            className="flex w-0 flex-col items-center gap-1 text-muted-foreground first:items-start last:items-end data-active:text-foreground"
          >
            <span className="h-1.5 w-px bg-foreground/30" />
            {stop.label}
          </span>
        ))}
      </div>
    </Slider>
  )
}

export { PatternSlider }
