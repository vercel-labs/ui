"use client"

import * as React from "react"

// Temporary: lets the team pick how strong the poster patterns are. Delete
// this file and its use in app/page.tsx once a level is chosen.

const storageKey = "ui-sdk:pattern-intensity"

const stops = [
  { label: "Full", value: 100 },
  { label: "Down", value: 50 },
  { label: "Off", value: 0 },
]

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
      stored = Number(localStorage.getItem(storageKey) ?? 100)
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
    <div className="fixed end-4 bottom-4 z-50 flex w-64 flex-col gap-3 border border-foreground bg-background p-4 font-mono text-[11px] leading-4 tracking-[0.06em] uppercase">
      <label htmlFor="pattern-intensity" className="flex justify-between">
        <span>Patterns</span>
        <span className="text-muted-foreground tabular-nums">{value}%</span>
      </label>
      <input
        id="pattern-intensity"
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(event) => change(Number(event.target.value))}
        className="w-full [accent-color:var(--foreground)]"
      />
      <div className="grid grid-cols-3 gap-1">
        {stops.map((stop) => (
          <button
            key={stop.label}
            type="button"
            aria-pressed={value === stop.value}
            onClick={() => change(stop.value)}
            className="h-8 border border-foreground/20 uppercase outline-none aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006bff] focus-visible:outline-solid"
          >
            {stop.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export { PatternSlider }
