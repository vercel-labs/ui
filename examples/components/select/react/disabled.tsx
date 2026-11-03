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
import { CheckIcon, ChevronDownIcon } from "lucide-react"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes" },
  { value: "pineapple", label: "Pineapple" },
]

function Example() {
  return (
    <div data-slot="stack">
      {(["disabled", "readOnly", "item"] as const).map((variant) => (
        <Select
          key={variant}
          defaultValue={variant === "item" ? null : "banana"}
          placeholder="Select a fruit"
          disabled={variant === "disabled"}
          readOnly={variant === "readOnly"}
        >
          <div data-slot="stack">
            <SelectLabel>
              {variant === "disabled" ? "Disabled" : variant === "readOnly" ? "Read-only" : "Disabled item"}
            </SelectLabel>
            <SelectTrigger>
              <SelectValue />
              <ChevronDownIcon />
            </SelectTrigger>
          </div>
          <SelectContent>
            {fruits.map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value} disabled={fruit.value === "grapes"}>
                {fruit.label}
                <SelectItemIndicator>
                  <CheckIcon />
                </SelectItemIndicator>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  )
}

export { Example }
