"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectSelectAll,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import { CheckIcon, ChevronDownIcon, MinusIcon } from "lucide-react"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

function Example() {
  return (
    <Select multiple defaultValue={["apple", "banana", "grapes"]} placeholder="Select fruits">
      <div data-slot="stack">
        <SelectLabel>Fruits</SelectLabel>
        <SelectTrigger>
          <SelectValue max={2} moreLabel={(count) => `${count} more`} />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectSelectAll>
          {(state) => (
            <>
              Select all
              {state.checked && <CheckIcon />}
              {state.indeterminate && <MinusIcon />}
            </>
          )}
        </SelectSelectAll>
        <SelectSeparator />
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
  )
}

export { Example }
