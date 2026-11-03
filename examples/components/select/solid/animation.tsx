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

export function Example() {
  const [status, setStatus] = createSignal("Closed")

  return (
    <Select
      defaultValue="banana"
      onOpenChange={(open) => setStatus(open ? "Opening…" : "Closing…")}
      onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
    >
      <div data-slot="stack">
        <SelectLabel>Fruit</SelectLabel>
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
        <output data-slot="output">{status()}</output>
      </div>
      <SelectContent>
        <For each={fruits}>
          {(fruit) => (
            <SelectItem value={fruit.value}>
              {fruit.label}
              <SelectItemIndicator keepMounted>
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
  )
}
