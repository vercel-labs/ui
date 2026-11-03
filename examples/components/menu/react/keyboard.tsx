"use client"

import * as React from "react"
import { Menu, MenuContent, MenuRadioGroup, MenuRadioItem, MenuTrigger } from "@ui-sdk/react/menu"

const statuses = [
  { value: "online", label: "Online", hint: "Visible to everyone" },
  { value: "away", label: "Away", hint: "Shown as idle" },
  { value: "busy", label: "Do not disturb", hint: "Notifications are muted" },
  { value: "invisible", label: "Invisible", hint: "Appear offline" },
]

function Example() {
  const [status, setStatus] = React.useState("online")
  const current = statuses.find((option) => option.value === status)!

  return (
    <div data-slot="stack">
      <Menu loop={false}>
        <MenuTrigger>{current.label}</MenuTrigger>
        <MenuContent>
          <MenuRadioGroup value={status} onValueChange={setStatus}>
            {statuses.map((option) => (
              <MenuRadioItem key={option.value} value={option.value} label={option.label} closeOnSelect>
                <span data-slot="stack">
                  {option.label}
                  <span data-slot="hint">{option.hint}</span>
                </span>
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
      <output data-slot="output">Arrow keys stop at the ends. Type a status to jump to it.</output>
    </div>
  )
}

export { Example }
