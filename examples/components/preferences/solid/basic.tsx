import { createLocalStorage, createPreference } from "@ui-sdk/core"
import { Button } from "@ui-sdk/solid/button"
import { Preferences, usePreference } from "@ui-sdk/solid/preferences"
import { For } from "solid-js"

const density = createPreference({
  values: ["comfortable", "compact"],
  defaultValue: "comfortable",
  attribute: "data-density",
  storage: createLocalStorage("ui-sdk-preferences-density"),
})

function Example() {
  const densityState = usePreference(density)

  return (
    <Preferences preferences={[density]}>
      <div data-slot="card">
        <Button
          aria-pressed={densityState().value === "compact" ? "true" : "false"}
          onClick={(event) =>
            density.set(densityState().value === "compact" ? "comfortable" : "compact", {
              reason: "press",
              event,
            })
          }
        >
          Compact layout
        </Button>
        <ul data-slot="list" aria-label="Documents">
          <For each={["Project notes", "Meeting notes", "Release notes"]}>{(name) => <li>{name}</li>}</For>
        </ul>
        <span data-slot="hint">Density: {densityState().value}</span>
      </div>
    </Preferences>
  )
}

export { Example }
