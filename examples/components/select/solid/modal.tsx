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

const modes = [
  { value: "pointer", label: "Pointer" },
  { value: true, label: "Modal" },
  { value: false, label: "Non-modal" },
] as const

export function Example() {
  const [modal, setModal] = createSignal<boolean | "pointer">("pointer")
  const [presses, setPresses] = createSignal(0)

  return (
    <div data-slot="stack">
      <div role="group" aria-label="Modal" data-slot="row">
        <For each={modes}>
          {(mode) => (
            <button
              type="button"
              aria-pressed={modal() === mode.value ? "true" : "false"}
              onClick={() => setModal(mode.value)}
            >
              {mode.label}
            </button>
          )}
        </For>
      </div>
      <Select modal={modal()} defaultValue="apple">
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
      <button type="button" onClick={() => setPresses((count) => count + 1)}>
        Pressed {presses()} times
      </button>
    </div>
  )
}
