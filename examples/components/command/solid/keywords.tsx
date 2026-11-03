import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/solid/command"
import { For } from "solid-js"

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
        <For each={commands}>
          {(item) => (
            <CommandItem value={item.value} label={item.label} keywords={item.keywords}>
              <strong>{item.label}</strong>
            </CommandItem>
          )}
        </For>
      </CommandList>
    </Command>
  )
}

export { Example }
