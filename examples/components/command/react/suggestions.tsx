"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  type CommandData,
} from "@ui-sdk/react/command"
import { SearchIcon } from "lucide-react"

const commands: CommandData = [
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

const suggested: CommandData = [
  { type: "group", label: "Suggested", items: ["New file", "Settings", "Help"] },
]

function Example() {
  return (
    <Command
      items={commands}
      emptyItems={suggested}
      announcement={(change) => (change.type === "results" ? `${change.count} commands` : null)}
    >
      <div data-slot="row">
        <SearchIcon aria-hidden="true" />
        <CommandInput aria-label="Search commands" placeholder="Search commands…" />
      </div>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(state) =>
          (state.items as (string | { label: string; items: string[] })[]).map((entry) =>
            typeof entry === "string" ? (
              <CommandItem key={entry} value={entry}>
                <CommandItemText />
              </CommandItem>
            ) : (
              <CommandGroup key={entry.label}>
                <CommandGroupLabel>{entry.label}</CommandGroupLabel>
                {entry.items.map((command) => (
                  <CommandItem key={command} value={command}>
                    <CommandItemText />
                  </CommandItem>
                ))}
              </CommandGroup>
            ),
          )
        }
      </CommandList>
    </Command>
  )
}

export { Example }
