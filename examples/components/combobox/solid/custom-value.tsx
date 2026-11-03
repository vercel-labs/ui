import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
} from "@ui-sdk/solid/combobox"
import { createSignal, For } from "solid-js"

const titles = ["Designer", "Engineer", "Engineering manager", "Product manager", "Researcher"]

function Example() {
  const [value, setValue] = createSignal<string | null>(null)

  return (
    <div data-slot="stack">
      <Combobox allowCustomValue value={value} onValueChange={setValue}>
        <div data-slot="stack">
          <ComboboxLabel>Job title</ComboboxLabel>
          <ComboboxInput placeholder="Type any title" />
        </div>
        <ComboboxContent>
          <ComboboxEmpty>
            {(state) => (state.empty ? `Press Enter to use “${state.query}”.` : null)}
          </ComboboxEmpty>
          <ComboboxList>
            <For each={titles}>
              {(title) => (
                <ComboboxItem value={title}>
                  {title}
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
      <output data-slot="output">Value: {JSON.stringify(value)}</output>
    </div>
  )
}

export { Example }
