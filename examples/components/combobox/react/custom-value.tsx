"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
} from "@ui-sdk/react/combobox"
import { CheckIcon } from "lucide-react"
import * as React from "react"

const titles = ["Designer", "Engineer", "Engineering manager", "Product manager", "Researcher"]

function Example() {
  const [value, setValue] = React.useState<string | null>(null)

  return (
    <div data-slot="stack">
      <Combobox allowCustomValue value={value} onValueChange={setValue}>
        <div data-slot="stack">
          <ComboboxLabel>Job title</ComboboxLabel>
          <ComboboxInput placeholder="Type any title" />
        </div>
        <ComboboxContent>
          <ComboboxEmpty>
            {(state) => (state.empty ? `Press Enter to use “${state.query}”.` : null)}
          </ComboboxEmpty>
          <ComboboxList>
            {titles.map((title) => (
              <ComboboxItem key={title} value={title}>
                {title}
                <ComboboxItemIndicator>
                  <CheckIcon aria-hidden="true" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <output data-slot="output">Value: {JSON.stringify(value)}</output>
    </div>
  )
}

export { Example }
