import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { For } from "solid-js"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

function Example() {
  return (
    <div data-slot="stack">
      <For each={["disabled", "readOnly", "item"] as const}>
        {(variant) => (
          <Select
            defaultValue={variant === "item" ? null : "banana"}
            placeholder="Select a fruit"
            disabled={variant === "disabled"}
            readOnly={variant === "readOnly"}
          >
            <div data-slot="stack">
              <SelectLabel>
                {variant === "disabled" ? "Disabled" : variant === "readOnly" ? "Read-only" : "Disabled item"}
              </SelectLabel>
              <SelectTrigger>
                <SelectValue />
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
                  <SelectItem value={fruit.value} disabled={fruit.value === "grapes"}>
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
        )}
      </For>
    </div>
  )
}

export { Example }
