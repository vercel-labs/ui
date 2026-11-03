import {
  Select,
  SelectArrow,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
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

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

export function Example() {
  const [side, setSide] = React.useState<(typeof sides)[number]>("bottom")
  const [align, setAlign] = React.useState<(typeof aligns)[number]>("start")
  const [box, setBox] = React.useState<HTMLDivElement | null>(null)
  const [anchored, setAnchored] = React.useState(false)

  return (
    <div data-slot="stack">
      <div data-slot="stack">
        <div role="group" aria-label="Side" data-slot="row">
          {sides.map((value) => (
            <button key={value} type="button" aria-pressed={side === value} onClick={() => setSide(value)}>
              {value}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Align" data-slot="row">
          {aligns.map((value) => (
            <button key={value} type="button" aria-pressed={align === value} onClick={() => setAlign(value)}>
              {value}
            </button>
          ))}
        </div>
        <label data-slot="label">
          <input
            type="checkbox"
            checked={anchored}
            onChange={(event) => setAnchored(event.currentTarget.checked)}
          />
          Anchor to the box
        </label>
      </div>
      <div ref={setBox} data-slot="card">
        <Select defaultValue="apple">
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
            <ChevronDownIcon />
          </SelectTrigger>
          <SelectContent
            side={side}
            align={align}
            sideOffset={10}
            alignOffset={0}
            collisionPadding={16}
            anchor={anchored ? box : null}
          >
            <SelectArrow />
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
      </div>
    </div>
  )
}
