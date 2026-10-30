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
      <div class="flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-card p-5 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10">
        <Button
          aria-pressed={densityState().value === "compact" ? "true" : "false"}
          onClick={(event) =>
            density.set(densityState().value === "compact" ? "comfortable" : "compact", {
              reason: "press",
              event,
            })
          }
          class="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 self-start rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-[color,background-color,box-shadow] hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px data-disabled:pointer-events-none data-disabled:opacity-50"
        >
          Compact layout
        </Button>
        <ul class="h-40 space-y-2" aria-label="Documents">
          <For each={["Project notes", "Meeting notes", "Release notes"]}>
            {(name) => (
              <li class="rounded-xl bg-muted/50 px-3 py-3 [[data-density=compact]_&]:py-1">{name}</li>
            )}
          </For>
        </ul>
        <span class="text-muted-foreground">Density: {densityState().value}</span>
      </div>
    </Preferences>
  )
}

export { Example }
