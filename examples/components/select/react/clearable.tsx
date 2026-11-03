"use client"

import {
  Select,
  SelectClear,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import * as React from "react"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

function Example() {
  const [value, setValue] = React.useState<string | null>("banana")

  return (
    <div data-slot="stack">
      <Select value={value} onValueChange={setValue} placeholder="Select a fruit">
        <div data-slot="stack">
          <SelectLabel>Fruit</SelectLabel>
          <div data-slot="row">
            <SelectTrigger>
              <SelectValue />
              <ChevronDownIcon />
            </SelectTrigger>
            <SelectClear aria-label="Clear fruit">
              <XIcon />
            </SelectClear>
          </div>
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
