"use client"

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

function Example() {
  const [value, setValue] = React.useState<string[]>(["apple", "grapes"])

  return (
    <div data-slot="stack">
      <Select multiple value={value} onValueChange={setValue} placeholder="Select fruits">
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
      <output data-slot="output">Value: {JSON.stringify(value)}</output>
    </div>
  )
}

export { Example }
