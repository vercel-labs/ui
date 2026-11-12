import type * as React from "react"

const line = "color-mix(in oklab, var(--foreground) 9%, var(--background))"

const hatch: React.CSSProperties = {
  backgroundImage: `repeating-linear-gradient(-45deg, ${line} 0 1px, transparent 1px 6px)`,
}

const grid: React.CSSProperties = {
  backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
  backgroundSize: "16px 16px",
  backgroundPosition: "-1px -1px",
  boxShadow: `inset 0 0 0 1px ${line}`,
}

export { grid, hatch }
