import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from "@ui-sdk/solid/combobox"
import { For } from "solid-js"

const labels = ["Bug", "Feature", "Documentation", "Design", "Performance", "Security", "Testing"]

function Example() {
  return (
    <Combobox multiple keepQuery>
      <div data-slot="stack">
        <ComboboxLabel>Labels</ComboboxLabel>
        <ComboboxChips>
          <ComboboxValue>
            {(state) => (
              <For each={state.value as string[]}>
                {(label) => (
                  <ComboboxChip value={label}>
                    {label}
                    <ComboboxChipRemove aria-label={`Remove ${label}`}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </ComboboxChipRemove>
                  </ComboboxChip>
                )}
              </For>
            )}
          </ComboboxValue>
          <ComboboxInput placeholder="Add labels" />
        </ComboboxChips>
      </div>
      <ComboboxContent>
        <ComboboxList>
          <For each={labels}>
            {(label) => (
              <ComboboxItem value={label}>
                {label}
                <ComboboxItemIndicator>
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
                </ComboboxItemIndicator>
              </ComboboxItem>
            )}
          </For>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { Example }
