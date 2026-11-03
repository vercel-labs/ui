import { CheckIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  createSelectController,
} from "@ui-sdk/react/select"
import * as React from "react"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

const fruit = createSelectController<string>()

export function Example() {
  const [log, setLog] = React.useState("")

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <span data-slot="hint">Toolbar</span>
        <SelectTrigger controller={fruit} aria-label="Fruit" />
      </div>
      <Select controller={fruit} items={fruits} placeholder="Fruit">
        <SelectContent>
          {fruits.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
              <SelectItemIndicator>
                <CheckIcon />
              </SelectItemIndicator>
            </SelectItem>
          ))}
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
      <output data-slot="output">{log || "Use the buttons"}</output>
    </div>
  )
}
