"use client"

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/react/command"

const commands = [
  { value: "calendar", label: "Calendar" },
  { value: "emoji", label: "Search Emoji", keywords: ["smiley", "face"] },
  { value: "calculator", label: "Calculator" },
]

function Example() {
  return (
    <Command>
      <CommandInput aria-label="Search commands" placeholder="Try “smiley”" />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {commands.map((item) => (
          <CommandItem key={item.value} value={item.value} label={item.label} keywords={item.keywords}>
            <strong>{item.label}</strong>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  )
}

export { Example }
