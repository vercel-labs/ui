import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  createSelectController,
} from "@ui-sdk/solid/select"
import { For, createSignal } from "solid-js"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const fruit = createSelectController<string>()

export function Example() {
  const [log, setLog] = createSignal("")

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <span data-slot="hint">Toolbar</span>
        <SelectTrigger controller={fruit} aria-label="Fruit" />
      </div>
      <Select controller={fruit} items={fruits} placeholder="Fruit">
        <SelectContent>
          <For each={fruits}>
            {(item) => (
              <SelectItem value={item.value}>
                {item.label}
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
      <div data-slot="row">
        <button
          type="button"
          onClick={async () => {
            const { reason } = await fruit.open()
            setLog(`Closed by ${reason}, with ${fruit.getValue() ?? "nothing"}`)
          }}
        >
          Open
        </button>
        <button type="button" onClick={() => fruit.setValue("banana")}>
          Banana
        </button>
        <button type="button" onClick={() => fruit.clear()}>
          Clear
        </button>
        <button type="button" onClick={() => fruit.focus()}>
          Focus
        </button>
      </div>
      <output data-slot="output">{log() || "Use the buttons"}</output>
    </div>
  )
}
