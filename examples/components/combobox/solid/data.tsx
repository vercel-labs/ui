import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@ui-sdk/solid/combobox"
import { For } from "solid-js"

const fruits: { value: string; label: string; keywords?: string[]; disabled?: boolean }[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", keywords: ["red"] },
]

const citrus: { value: string; label: string; keywords?: string[]; disabled?: boolean }[] = [
  { value: "lemon", label: "Lemon" },
  { value: "lime", label: "Lime" },
  { value: "orange", label: "Orange", disabled: true },
]

function Example() {
  return (
    <Combobox>
      <div data-slot="stack">
        <ComboboxLabel>Fruit</ComboboxLabel>
        <div data-slot="row">
          <ComboboxInput placeholder="Search fruits" />
          <ComboboxTrigger aria-label="Show fruits">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </ComboboxTrigger>
        </div>
      </div>
      <ComboboxContent>
        <ComboboxList>
          <For each={fruits}>
            {(fruit) => (
              <ComboboxItem
                value={fruit.value}
                label={fruit.label}
                keywords={fruit.keywords}
                disabled={fruit.disabled}
              >
                {fruit.label}
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
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxGroupLabel>Citrus</ComboboxGroupLabel>
            <For each={citrus}>
              {(fruit) => (
                <ComboboxItem
                  value={fruit.value}
                  label={fruit.label}
                  keywords={fruit.keywords}
                  disabled={fruit.disabled}
                >
                  {fruit.label}
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
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { Example }
