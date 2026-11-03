import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

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
  const [modal, setModal] = React.useState<boolean | "pointer">("pointer")
  const [presses, setPresses] = React.useState(0)

  return (
    <div data-slot="stack">
      <div role="group" aria-label="Modal" data-slot="row">
        {modes.map((mode) => (
          <button
            key={mode.label}
            type="button"
            aria-pressed={modal === mode.value}
            onClick={() => setModal(mode.value)}
          >
            {mode.label}
          </button>
        ))}
      </div>
      <Select modal={modal} defaultValue="apple">
        <div data-slot="stack">
          <SelectLabel>Fruit</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <ChevronDownIcon />
          </SelectTrigger>
        </div>
        <SelectContent>
          {fruits.map((fruit) => (
            <SelectItem key={fruit.value} value={fruit.value}>
              {fruit.label}
              <SelectItemIndicator>
                <CheckIcon />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button type="button" onClick={() => setPresses((count) => count + 1)}>
        Pressed {presses} times
      </button>
    </div>
  )
}
