"use client"

import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

const produce = [
  {
    label: "Fruits",
    items: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange" },
    ],
  },
  {
    label: "Vegetables",
    items: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
      { value: "spinach", label: "Spinach" },
    ],
  },
]

function Example() {
  return (
    <Select placeholder="Select produce">
      <div data-slot="stack">
        <SelectLabel>Produce</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <ChevronDownIcon />
        </SelectTrigger>
      </div>
      <SelectContent>
        <SelectInput aria-label="Search produce" placeholder="Search…" />
        <SelectEmpty>Nothing found.</SelectEmpty>
        <SelectList>
          {produce.map((group) => (
            <SelectGroup key={group.label}>
              <SelectGroupLabel>{group.label}</SelectGroupLabel>
              {group.items.map((item) => (
                <SelectItem key={item.value} value={item.value} label={item.label}>
                  <SelectItemText>
                    {(state) =>
                      state.segments.map((segment, index) =>
                        segment.match ? <b key={index}>{segment.text}</b> : segment.text,
                      )
                    }
                  </SelectItemText>
                  <SelectItemIndicator>
                    <CheckIcon />
                  </SelectItemIndicator>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectList>
      </SelectContent>
    </Select>
  )
}

export { Example }
