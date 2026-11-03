import { Command, CommandInput, CommandItem, CommandList, CommandPage } from "@ui-sdk/solid/command"
import { createSignal, For } from "solid-js"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

export function Example() {
  const [value, setValue] = createSignal<string | null>("dark")
  const [query, setQuery] = createSignal("")
  const [pages, setPages] = createSignal(["theme"])
  const [reason, setReason] = createSignal("")
  return (
    <div data-slot="stack">
      <Command
        value={value()}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        query={query()}
        onQueryChange={(next) => setQuery(next)}
        pages={pages()}
        onPagesChange={(next) => setPages(next)}
      >
        <CommandInput aria-label="Search themes" placeholder="Search themes..." />
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
      <output data-slot="output">
        Highlighted {value() ?? "nothing"} ({reason() || "start"}), text “{query()}”, pages [
        {pages().join(", ")}]
      </output>
      <Command defaultValue="system" defaultQuery="s" defaultPages={[]} debug>
        <CommandInput aria-label="Search themes, uncontrolled" />
        <CommandList>
          <For each={themes}>{(theme) => <CommandItem value={theme.value}>{theme.label}</CommandItem>}</For>
        </CommandList>
      </Command>
    </div>
  )
}
