import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPage,
  createCommandController,
} from "@ui-sdk/react/command"
import * as React from "react"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

const palette = createCommandController()

export function Example() {
  const [ran, setRan] = React.useState("")
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
      <Command controller={palette} onAction={setRan}>
        <CommandInput aria-label="Search commands" />
        <CommandList>
          <CommandPage>
            <CommandItem value="theme" page="theme">
              Change theme…
            </CommandItem>
          </CommandPage>
          <CommandPage value="theme">
            {themes.map((theme) => (
              <CommandItem key={theme.value} value={theme.value}>
                {theme.label}
              </CommandItem>
            ))}
          </CommandPage>
        </CommandList>
      </Command>
      <output data-slot="output">{ran ? `Ran ${ran}` : "Nothing run yet"}</output>
    </div>
  )
}
