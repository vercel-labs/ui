"use client"

import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import * as React from "react"

const weights = [
  { value: "light", label: "Light" },
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "bold", label: "Bold" },
]

function Example() {
  const [weight, setWeight] = React.useState("normal")

  return (
    <div data-slot="stack">
      <ToggleGroup
        defaultValue={["normal"]}
        deselectable={false}
        aria-label="Font weight"
        onValueChange={(value) => setWeight(value[0] ?? "normal")}
      >
        {weights.map((item) => (
          <Toggle key={item.value} value={item.value} data-variant={item.value}>
            {item.label}
          </Toggle>
        ))}
      </ToggleGroup>
      <p data-variant={weight}>The quick brown fox jumps over the lazy dog.</p>
    </div>
  )
}

export { Example }
