<script lang="ts">
  import {
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
  } from "@ui-sdk/svelte/autocomplete"

  const fruits = [
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    "Blackberry",
    "Blueberry",
    "Cherry",
    "Grape",
    "Lemon",
    "Mango",
    "Orange",
    "Peach",
    "Pear",
    "Pineapple",
    "Strawberry",
  ]

  let value = $state("")
  let open = $state(false)
  let log = $state("")

  function changeValue(next: string, details: { reason: string; cancel: () => void }) {
    if (next.length > 12) return details.cancel()
    log = `text: ${details.reason}`
  }
</script>

<div data-slot="stack">
  <Autocomplete
    bind:value
    bind:open
    debug
    onValueChange={changeValue}
    onOpenChange={(next, details) => (log = `${next ? "opened" : "closed"}: ${details.reason}`)}
    onOpenChangeComplete={(next) => (log = `${next ? "opened" : "closed"} and settled`)}
    onHighlight={(highlighted) => highlighted && (log = `highlighted ${highlighted}`)}
  >
    <AutocompleteLabel>Fruit (12 characters at most)</AutocompleteLabel>
    <AutocompleteInput />
    <AutocompleteContent>
      <AutocompleteList>
        {#each fruits as fruit (fruit)}
          <AutocompleteItem value={fruit}>
            {fruit}
          </AutocompleteItem>
        {/each}
      </AutocompleteList>
    </AutocompleteContent>
  </Autocomplete>
  <output data-slot="output">{log || "Type something"}</output>
</div>
