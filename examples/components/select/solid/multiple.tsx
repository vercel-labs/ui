import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { createSignal, For } from "solid-js"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

function Example() {
  const [value, setValue] = createSignal<string[]>(["apple", "grapes"])

  return (
    <div data-slot="stack">
      <Select multiple value={value()} onValueChange={setValue} placeholder="Select fruits">
        <div data-slot="stack">
          <SelectLabel>Fruits</SelectLabel>
          <SelectTrigger>
            <SelectValue>
              {(state) =>
                state.placeholder
                  ? "Select fruits"
                  : state.labels.length > 2
                    ? `${state.labels[0]} and ${state.labels.length - 1} more`
                    : state.label
              }
            </SelectValue>
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
          </SelectTrigger>
        </div>
        <SelectContent>
          <For each={fruits}>
            {(fruit) => (
              <SelectItem value={fruit.value}>
                {fruit.label}
                <SelectItemIndicator>
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
                </SelectItemIndicator>
              </SelectItem>
            )}
          </For>
        </SelectContent>
      </Select>
      <output data-slot="output">Value: {JSON.stringify(value())}</output>
    </div>
  )
}

export { Example }
