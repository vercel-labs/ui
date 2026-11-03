"use client"

import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/react/listbox"
import { CheckIcon } from "lucide-react"
import * as React from "react"

const timezones = Array.from({ length: 27 }, (_, index) => {
  const offset = index - 12
  const label = `UTC${offset < 0 ? "−" : "+"}${String(Math.abs(offset)).padStart(2, "0")}:00`
  return { value: `utc${offset}`, label }
})

function Example() {
  const [highlighted, setHighlighted] = React.useState<string | null>(null)

  return (
    <div data-slot="stack">
      <Listbox defaultValue="utc9" onHighlight={(value) => setHighlighted(value)} aria-label="Time zone">
        {timezones.map((zone, index) => (
          <ListboxItem key={zone.value} value={zone.value} index={index}>
            {zone.label}
            <ListboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ListboxItemIndicator>
          </ListboxItem>
        ))}
      </Listbox>
      <output data-slot="output">Focused: {highlighted ?? "none"}</output>
    </div>
  )
}

export { Example }
