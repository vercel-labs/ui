import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/solid/command"
import { createSignal, For } from "solid-js"

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
  const [mode, setMode] = createSignal<(typeof filters)[number]>("fuzzy")
  const filter = () => {
    const current = mode()
    return current === "words" ? words : current
  }
  return (
    <div data-slot="stack">
      <div data-slot="row">
        <For each={filters}>
          {(name) => (
            <button
              type="button"
              aria-pressed={mode() === name ? "true" : "false"}
              onClick={() => setMode(name)}
            >
              {name}
            </button>
          )}
        </For>
      </div>
      <Command filter={filter()}>
        <CommandInput aria-label="Search commands" placeholder="Try “nf” or “zo in”" />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList>
          <For each={commands}>{(label) => <CommandItem value={label}>{label}</CommandItem>}</For>
        </CommandList>
      </Command>
    </div>
  )
}

export { Example }
