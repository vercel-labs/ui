"use client"

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/react/command"
import * as React from "react"

const commands = [
  "Home",
  "Inbox",
  "Documents",
  "Downloads",
  "Pictures",
  "Music",
  "New file",
  "New folder",
  "Copy",
  "Cut",
  "Paste",
  "Delete",
  "Zoom in",
  "Zoom out",
  "Notifications",
  "Help",
  "Keyboard shortcuts",
  "Settings",
]

const filters = ["fuzzy", "contains", "startsWith", "words"] as const

function words(item: { label: string }, query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) =>
      item.label
        .toLowerCase()
        .split(" ")
        .some((part) => part.startsWith(word)),
    )
}

function Example() {
  const [mode, setMode] = React.useState<(typeof filters)[number]>("fuzzy")
  return (
    <div data-slot="stack">
      <div data-slot="row">
        {filters.map((name) => (
          <button key={name} type="button" aria-pressed={mode === name} onClick={() => setMode(name)}>
            {name}
          </button>
        ))}
      </div>
      <Command filter={mode === "words" ? words : mode}>
        <CommandInput aria-label="Search commands" placeholder="Try “nf” or “zo in”" />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList>
          {commands.map((label) => (
            <CommandItem key={label} value={label}>
              {label}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  )
}

export { Example }
