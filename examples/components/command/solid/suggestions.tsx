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
} from "@ui-sdk/solid/command"
import { For } from "solid-js"

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
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
        <CommandInput aria-label="Search commands" placeholder="Search commands…" />
      </div>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(state) => (
          <For each={state.items as (string | { label: string; items: string[] })[]}>
            {(entry) =>
              typeof entry === "string" ? (
                <CommandItem value={entry}>
                  <CommandItemText />
                </CommandItem>
              ) : (
                <CommandGroup>
                  <CommandGroupLabel>{entry.label}</CommandGroupLabel>
                  <For each={entry.items}>
                    {(command) => (
                      <CommandItem value={command}>
                        <CommandItemText />
                      </CommandItem>
                    )}
                  </For>
                </CommandGroup>
              )
            }
          </For>
        )}
      </CommandList>
    </Command>
  )
}

export { Example }
