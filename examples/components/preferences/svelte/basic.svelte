<script lang="ts">
  import { createLocalStorage, createPreference } from "@ui-sdk/core"
  import { Button } from "@ui-sdk/svelte/button"
  import { Preferences, usePreference } from "@ui-sdk/svelte/preferences"

  const density = createPreference({
    values: ["comfortable", "compact"],
    defaultValue: "comfortable",
    attribute: "data-density",
    storage: createLocalStorage("ui-sdk-preferences-density"),
  })
  const state = usePreference(density)
</script>

<Preferences preferences={[density]}>
  <div data-slot="card"
  >
    <Button
      aria-pressed={state.current.value === "compact"}
      onclick={(event) =>
        density.set(state.current.value === "compact" ? "comfortable" : "compact", {
          reason: "press",
          event,
        })}
    >
      Compact layout
    </Button>
    <ul data-slot="list" aria-label="Documents">
      {#each ["Project notes", "Meeting notes", "Release notes"] as name (name)}
        <li>
          {name}
        </li>
      {/each}
    </ul>
    <span data-slot="hint">Density: {state.current.value}</span>
  </div>
</Preferences>
