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
  const [aligned, setAligned] = React.useState(true)

  return (
    <div data-slot="stack">
      <Select defaultValue="blueberry">
        <div data-slot="stack">
          <SelectLabel>Fruit</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <ChevronDownIcon />
          </SelectTrigger>
        </div>
        <SelectContent alignItemWithTrigger={aligned}>
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
      <label data-slot="label">
        <input
          type="checkbox"
          checked={aligned}
          onChange={(event) => setAligned(event.currentTarget.checked)}
        />
        Align item with trigger
      </label>
    </div>
  )
}

export { Example }
