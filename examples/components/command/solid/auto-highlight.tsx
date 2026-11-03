import { Command, CommandInput, CommandItem, CommandList } from "@ui-sdk/solid/command"
import { For } from "solid-js"

const commands = ["Home", "Inbox", "Documents", "Downloads", "Pictures", "Music", "New file", "New folder"]

function Example() {
  return (
    <Command autoHighlight={false} loop={false}>
      <CommandInput aria-label="Search commands" placeholder="Type, then press ArrowDown" />
      <CommandList>
        <For each={commands}>{(label) => <CommandItem value={label}>{label}</CommandItem>}</For>
      </CommandList>
    </Command>
  )
}

export { Example }
