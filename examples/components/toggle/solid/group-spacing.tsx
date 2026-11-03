import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/solid/toggle"
import { For } from "solid-js"

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
const Bookmark = icon(
  '<path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />',
)
const Heart = icon(
  '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />',
)
const Italic = icon(
  '<line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" />',
)
const Star = icon(
  '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />',
)
const Underline = icon('<path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" x2="20" y1="20" y2="20" />')

const formatting = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
]

const favorites = [
  { value: "star", label: "Star", icon: Star },
  { value: "heart", label: "Heart", icon: Heart },
  { value: "bookmark", label: "Bookmark", icon: Bookmark },
]

export function Example() {
  return (
    <div data-slot="stack">
      <ToggleGroup multiple aria-label="Text formatting">
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
      <ToggleGroup multiple data-variant="spaced" aria-label="Favorites">
        <For each={favorites}>
          {(item) => (
            <Toggle value={item.value} data-variant="outline">
              <ToggleIcon data-variant="fill">
                <item.icon />
              </ToggleIcon>
              {item.label}
            </Toggle>
          )}
        </For>
      </ToggleGroup>
    </div>
  )
}
