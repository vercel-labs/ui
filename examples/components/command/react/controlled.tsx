import { Command, CommandInput, CommandItem, CommandList, CommandPage } from "@ui-sdk/react/command"
import * as React from "react"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

export function Example() {
  const [value, setValue] = React.useState<string | null>("dark")
  const [query, setQuery] = React.useState("")
  const [pages, setPages] = React.useState(["theme"])
  const [reason, setReason] = React.useState("")
  return (
    <div data-slot="stack">
      <Command
        value={value}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        query={query}
        onQueryChange={setQuery}
        pages={pages}
        onPagesChange={setPages}
      >
        <CommandInput aria-label="Search themes" placeholder="Search themes..." />
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
      <output data-slot="output">
        Highlighted {value ?? "nothing"} ({reason || "start"}), text “{query}”, pages [{pages.join(", ")}]
      </output>
      <Command defaultValue="system" defaultQuery="s" defaultPages={[]} debug>
        <CommandInput aria-label="Search themes, uncontrolled" />
        <CommandList>
          {themes.map((theme) => (
            <CommandItem key={theme.value} value={theme.value}>
              {theme.label}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  )
}
