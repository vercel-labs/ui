import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPage,
  createCommandController,
} from "@ui-sdk/solid/command"
import { createSignal, For } from "solid-js"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

const palette = createCommandController()

export function Example() {
  const [ran, setRan] = createSignal("")
  return (
    <div data-slot="stack">
      <div data-slot="row">
        <button type="button" onClick={() => palette.push("theme")}>
          Open themes
        </button>
        <button type="button" onClick={() => palette.pop()}>
          Back
        </button>
        <button type="button" onClick={() => palette.setValue("dark")}>
          Highlight Dark
        </button>
        <button type="button" onClick={() => palette.setQuery("li")}>
          Search “li”
        </button>
        <button type="button" onClick={() => palette.run()}>
          Run highlighted
        </button>
        <button type="button" onClick={() => palette.focus()}>
          Focus
        </button>
      </div>
      <Command
        controller={palette}
        onAction={(value) => {
          setRan(value)
        }}
      >
        <CommandInput aria-label="Search commands" />
        <CommandList>
          <CommandPage>
            <CommandItem value="theme" page="theme">
              Change theme…
            </CommandItem>
          </CommandPage>
          <CommandPage value="theme">
            <For each={themes}>{(theme) => <CommandItem value={theme.value}>{theme.label}</CommandItem>}</For>
          </CommandPage>
        </CommandList>
      </Command>
      <output data-slot="output">{ran() ? `Ran ${ran()}` : "Nothing run yet"}</output>
    </div>
  )
}
