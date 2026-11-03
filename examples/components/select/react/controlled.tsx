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
  const [value, setValue] = React.useState<string | null>("apple")
  const [open, setOpen] = React.useState(false)
  const [log, setLog] = React.useState("")

  return (
    <div data-slot="stack">
      <Select
        value={value}
        onValueChange={(next, details) => {
          if (next === "pineapple") {
            details.cancel()
            setLog("Pineapple is sold out")
            return
          }
          setValue(next)
          setLog(`value: ${next} (${details.reason})`)
        }}
        open={open}
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
      <div data-slot="row">
        <button type="button" onClick={() => setValue("blueberry")}>
          Blueberry
        </button>
        <button type="button" onClick={() => setOpen(true)}>
          Open
        </button>
      </div>
      <output data-slot="output">{log || "Change something"}</output>
    </div>
  )
}
