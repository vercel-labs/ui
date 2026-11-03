import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/solid/command"
import { For } from "solid-js"

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
        <For each={commands}>{(label) => <CommandItem value={label}>{label}</CommandItem>}</For>
      </CommandList>
    </Command>
  )
}

export { Example }
