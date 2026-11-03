"use client"

import * as React from "react"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"

const options = [
  { value: "default", label: "Default", description: "Standard spacing for most use cases." },
  { value: "comfortable", label: "Comfortable", description: "More space between elements." },
  { value: "compact", label: "Compact", description: "Minimal spacing for dense layouts." },
]

function Example() {
  const id = React.useId()
  return (
    <RadioGroup defaultValue="comfortable" aria-label="Density">
      {options.map((option) => (
        <div data-slot="row" key={option.value}>
          <Radio
            value={option.value}
            id={`${id}-density-${option.value}`}
            aria-describedby={`${id}-density-${option.value}-description`}
          >
            <RadioIndicator />
          </Radio>
          <div data-slot="stack">
            <label data-slot="label" htmlFor={`${id}-density-${option.value}`}>
              {option.label}
            </label>
            <p data-slot="hint" id={`${id}-density-${option.value}-description`}>
              {option.description}
            </p>
          </div>
        </div>
      ))}
    </RadioGroup>
  )
}

export { Example }
