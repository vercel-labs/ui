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

export function Example() {
  const [status, setStatus] = React.useState("Closed")

  return (
    <Select
      defaultValue="banana"
      onOpenChange={(open) => setStatus(open ? "Opening…" : "Closing…")}
      onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
    >
      <div data-slot="stack">
        <SelectLabel>Fruit</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
        <output data-slot="output">{status}</output>
      </div>
      <SelectContent>
        {fruits.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
            <SelectItemIndicator keepMounted>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
