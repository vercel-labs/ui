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
const TextAlignCenter = icon('<path d="M21 5H3" /><path d="M17 12H7" /><path d="M19 19H5" />')
const TextAlignEnd = icon('<path d="M21 5H3" /><path d="M21 12H9" /><path d="M21 19H7" />')
const TextAlignStart = icon('<path d="M21 5H3" /><path d="M15 12H3" /><path d="M17 19H3" />')

const alignments = [
  { value: "left", label: "Align left", icon: TextAlignStart },
  { value: "center", label: "Align center", icon: TextAlignCenter },
  { value: "right", label: "Align right", icon: TextAlignEnd },
]

function Example() {
  return (
    <ToggleGroup defaultValue={["left"]} aria-label="Text alignment">
      <For each={alignments}>
        {(item) => (
          <Toggle value={item.value} aria-label={item.label}>
            <ToggleIcon>
              <item.icon />
            </ToggleIcon>
          </Toggle>
        )}
      </For>
    </ToggleGroup>
  )
}

export { Example }
