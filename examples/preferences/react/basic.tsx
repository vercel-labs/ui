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
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-card p-5 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10">
        <Button
          aria-pressed={value === "compact"}
          onClick={(event) =>
            density.set(value === "compact" ? "comfortable" : "compact", {
              reason: "press",
              event: event.nativeEvent,
            })
          }
          className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 self-start rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-[color,background-color,box-shadow] hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px data-disabled:pointer-events-none data-disabled:opacity-50"
        >
          Compact layout
        </Button>
        <ul className="h-40 space-y-2" aria-label="Documents">
          {["Project notes", "Meeting notes", "Release notes"].map((name) => (
            <li key={name} className="rounded-xl bg-muted/50 px-3 py-3 [[data-density=compact]_&]:py-1">
              {name}
            </li>
          ))}
        </ul>
        <span className="text-muted-foreground">Density: {value}</span>
      </div>
    </Preferences>
  )
}

export { Example }
