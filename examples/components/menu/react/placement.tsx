"use client"

import * as React from "react"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

function Example() {
  const [side, setSide] = React.useState<(typeof sides)[number]>("bottom")
  const [align, setAlign] = React.useState<(typeof aligns)[number]>("start")

  return (
    <div data-slot="stack">
      <div data-slot="stack">
        <div data-slot="row" role="group" aria-label="Side">
          {sides.map((value) => (
            <button key={value} data-size="sm" aria-pressed={side === value} onClick={() => setSide(value)}>
              {value}
            </button>
          ))}
        </div>
        <div data-slot="row" role="group" aria-label="Align">
          {aligns.map((value) => (
            <button key={value} data-size="sm" aria-pressed={align === value} onClick={() => setAlign(value)}>
              {value}
            </button>
          ))}
        </div>
      </div>
      <Menu>
        <MenuTrigger>Placement</MenuTrigger>
        <MenuContent side={side} align={align}>
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  )
}

export { Example }
