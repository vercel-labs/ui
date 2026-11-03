<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/svelte/listbox"

  const timezones = Array.from({ length: 27 }, (_, index) => {
    const offset = index - 12
    const label = `UTC${offset < 0 ? "−" : "+"}${String(Math.abs(offset)).padStart(2, "0")}:00`
    return { value: `utc${offset}`, label }
  })

  let highlighted = $state<unknown>(null)
</script>

<div data-slot="stack">
  <Listbox defaultValue="utc9" aria-label="Time zone" onHighlight={(value) => (highlighted = value)}>
    {#each timezones as zone, index (zone.value)}
      <ListboxItem value={zone.value} {index}>
        {zone.label}
        <ListboxItemIndicator>
          <CheckIcon aria-hidden="true" />
        </ListboxItemIndicator>
      </ListboxItem>
    {/each}
  </Listbox>
  <output data-slot="output">Focused: {highlighted ?? "none"}</output>
</div>
