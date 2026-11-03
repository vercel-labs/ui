import { Toggle, ToggleGroup } from "@ui-sdk/solid/toggle"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/solid/toolbar"
import { createSignal, For } from "solid-js"

const icon = (markup: string) => (props: { class?: string }) => (
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
const Strikethrough = icon(
  '<path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" x2="20" y1="12" y2="12" />',
)

const formats = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "strikethrough", label: "Strikethrough", icon: Strikethrough },
]

function Example() {
  const [style, setStyle] = createSignal<string[]>(["bold"])
  return (
    <div data-slot="stack">
      <Toolbar aria-label="Text">
        <ToggleGroup multiple value={style()} onValueChange={setStyle} aria-label="Text style">
          <For each={formats}>
            {({ value, label, icon: Icon }) => (
              <Toggle data-variant="ghost" value={value} aria-label={label}>
                <Icon />
              </Toggle>
            )}
          </For>
        </ToggleGroup>
        <ToolbarSeparator />
        <Toggle data-variant="ghost" aria-label="Code">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m16 18 6-6-6-6" />
            <path d="m8 6-6 6 6 6" />
          </svg>
        </Toggle>
        <ToolbarButton data-variant="secondary" onClick={() => setStyle([])}>
          Clear
        </ToolbarButton>
      </Toolbar>
      <output data-slot="output">Style: {style().join(", ") || "none"}</output>
    </div>
  )
}

export { Example }
