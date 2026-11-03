"use client"

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/react/command"

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

function Example() {
  return (
    <Command>
      <CommandInput aria-label="Search commands" placeholder="Search..." />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {commands.map((label) => (
          <CommandItem key={label} value={label}>
            {label}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  )
}

export { Example }
