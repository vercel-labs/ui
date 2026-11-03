import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/solid/listbox"
import { createSignal, For } from "solid-js"

const timezones = Array.from({ length: 27 }, (_, index) => {
  const offset = index - 12
  const label = `UTC${offset < 0 ? "−" : "+"}${String(Math.abs(offset)).padStart(2, "0")}:00`
  return { value: `utc${offset}`, label }
})

function Example() {
  const [highlighted, setHighlighted] = createSignal<string | null>(null)

  return (
    <div data-slot="stack">
      <Listbox defaultValue="utc9" onHighlight={(value) => setHighlighted(value)} aria-label="Time zone">
        <For each={timezones}>
          {(zone, index) => (
            <ListboxItem value={zone.value} index={index()}>
              {zone.label}
              <ListboxItemIndicator>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </ListboxItemIndicator>
            </ListboxItem>
          )}
        </For>
      </Listbox>
      <output data-slot="output">Focused: {highlighted() ?? "none"}</output>
    </div>
  )
}

export { Example }
