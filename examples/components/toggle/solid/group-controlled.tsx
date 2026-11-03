import { Toggle, ToggleGroup, ToggleIcon, createToggleGroupController } from "@ui-sdk/solid/toggle"
import { createSignal, For } from "solid-js"

const icon = (markup: string) => () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    innerHTML={markup}
  />
)
const Bold = icon('<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />')
const Italic = icon(
  '<line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" />',
)
const Underline = icon('<path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" x2="20" y1="20" y2="20" />')

const formatting = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
]

function Example() {
  const editor = createToggleGroupController()
  const [value, setValue] = createSignal(["bold"])
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <ToggleGroup
        multiple
        aria-label="Text formatting"
        value={value()}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        controller={editor}
      >
        <For each={formatting}>
          {(item) => (
            <Toggle value={item.value} aria-label={item.label}>
              <ToggleIcon>
                <item.icon />
              </ToggleIcon>
            </Toggle>
          )}
        </For>
      </ToggleGroup>
      <button type="button" onClick={() => editor.setValue([])}>
        Clear
      </button>
      <output data-slot="output">
        Pressed: {value().length ? value().join(", ") : "none"}
        {reason() && `, last change: ${reason()}`}
      </output>
    </div>
  )
}

export { Example }
