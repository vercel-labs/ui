"use client"

import { Command, CommandInput, CommandItem, CommandList } from "@ui-sdk/react/command"

const commands = ["Home", "Inbox", "Documents", "Downloads", "Pictures", "Music", "New file", "New folder"]

function Example() {
  return (
    <Command autoHighlight={false} loop={false}>
      <CommandInput aria-label="Search commands" placeholder="Type, then press ArrowDown" />
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
