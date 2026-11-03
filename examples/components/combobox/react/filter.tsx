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
  ComboboxTrigger,
} from "@ui-sdk/react/combobox"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import * as React from "react"

const countries = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "be", label: "Belgium" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "cl", label: "Chile" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "gr", label: "Greece" },
  { value: "jp", label: "Japan" },
  { value: "nl", label: "Netherlands" },
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
]

function fuzzy(item: { label: string }, query: string) {
  let at = 0
  for (const char of item.label.toLowerCase()) if (char === query[at]?.toLowerCase()) at++
  return at === query.length
}

const filters = [
  { name: "Contains", filter: "contains" },
  { name: "Starts with", filter: "startsWith" },
  { name: "Fuzzy", filter: fuzzy },
] as const

function Example() {
  const [mode, setMode] = React.useState<(typeof filters)[number]>(filters[0])

  return (
    <div data-slot="stack">
      <div role="group" aria-label="Filter" data-slot="row">
        {filters.map((option) => (
          <button
            key={option.name}
            type="button"
            aria-pressed={mode === option}
            onClick={() => setMode(option)}
          >
            {option.name}
          </button>
        ))}
      </div>
      <Combobox filter={mode.filter}>
        <div data-slot="stack">
          <ComboboxLabel>Country</ComboboxLabel>
          <div data-slot="row">
            <ComboboxInput placeholder="Try “an” or “swd”" />
            <ComboboxTrigger aria-label="Show countries">
              <ChevronDownIcon aria-hidden="true" />
            </ComboboxTrigger>
          </div>
        </div>
        <ComboboxContent>
          <ComboboxEmpty>No countries found.</ComboboxEmpty>
          <ComboboxList>
            {countries.map((country) => (
              <ComboboxItem key={country.value} value={country.value} label={country.label}>
                {country.label}
                <ComboboxItemIndicator>
                  <CheckIcon aria-hidden="true" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export { Example }
