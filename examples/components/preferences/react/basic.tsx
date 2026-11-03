import * as React from "react"
import { createLocalStorage, createPreference } from "@ui-sdk/core"
import { Button } from "@ui-sdk/react/button"
import { Preferences, usePreference } from "@ui-sdk/react/preferences"

const density = createPreference({
  values: ["comfortable", "compact"],
  defaultValue: "comfortable",
  attribute: "data-density",
  storage: createLocalStorage("ui-sdk-preferences-density"),
})

function Example() {
  const { value } = usePreference(density)

  return (
    <Preferences preferences={[density]}>
      <div data-slot="card">
        <Button
          aria-pressed={value === "compact"}
          onClick={(event) =>
            density.set(value === "compact" ? "comfortable" : "compact", {
              reason: "press",
              event: event.nativeEvent,
            })
          }
        >
          Compact layout
        </Button>
        <ul data-slot="list" aria-label="Documents">
          {["Project notes", "Meeting notes", "Release notes"].map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <span data-slot="hint">Density: {value}</span>
      </div>
    </Preferences>
  )
}

export { Example }
