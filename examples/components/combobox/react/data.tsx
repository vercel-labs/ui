"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@ui-sdk/react/combobox"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

const fruits: { value: string; label: string; keywords?: string[]; disabled?: boolean }[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", keywords: ["red"] },
]

const citrus: { value: string; label: string; keywords?: string[]; disabled?: boolean }[] = [
  { value: "lemon", label: "Lemon" },
  { value: "lime", label: "Lime" },
  { value: "orange", label: "Orange", disabled: true },
]

function Example() {
  return (
    <Combobox>
      <div data-slot="stack">
        <ComboboxLabel>Fruit</ComboboxLabel>
        <div data-slot="row">
          <ComboboxInput placeholder="Search fruits" />
          <ComboboxTrigger aria-label="Show fruits">
            <ChevronDownIcon aria-hidden="true" />
          </ComboboxTrigger>
        </div>
      </div>
      <ComboboxContent>
        <ComboboxList>
          {fruits.map((fruit) => (
            <ComboboxItem
              key={fruit.value}
              value={fruit.value}
              label={fruit.label}
              keywords={fruit.keywords}
              disabled={fruit.disabled}
            >
              {fruit.label}
              <ComboboxItemIndicator>
                <CheckIcon aria-hidden="true" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          ))}
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxGroupLabel>Citrus</ComboboxGroupLabel>
            {citrus.map((fruit) => (
              <ComboboxItem
                key={fruit.value}
                value={fruit.value}
                label={fruit.label}
                keywords={fruit.keywords}
                disabled={fruit.disabled}
              >
                {fruit.label}
                <ComboboxItemIndicator>
                  <CheckIcon aria-hidden="true" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { Example }
