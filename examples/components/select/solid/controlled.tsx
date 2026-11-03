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
  const [value, setValue] = createSignal<string | null>("apple")
  const [open, setOpen] = createSignal(false)
  const [log, setLog] = createSignal("")

  return (
    <div data-slot="stack">
      <Select
        value={value()}
        onValueChange={(next, details) => {
          if (next === "pineapple") {
            details.cancel()
            setLog("Pineapple is sold out")
            return
          }
          setValue(next)
          setLog(`value: ${next} (${details.reason})`)
        }}
        open={open()}
        onOpenChange={(next, details) => {
          setOpen(next)
          setLog(`open: ${next} (${details.reason})`)
        }}
        debug
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
      <div data-slot="row">
        <button type="button" onClick={() => setValue("blueberry")}>
          Blueberry
        </button>
        <button type="button" onClick={() => setOpen(true)}>
          Open
        </button>
      </div>
      <output data-slot="output">{log() || "Change something"}</output>
    </div>
  )
}
