<script lang="ts">
  import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/svelte/command"

  const commands = [
    "Home",
    "Inbox",
    "Documents",
    "Downloads",
    "Pictures",
    "Music",
    "New file",
    "New folder",
    "Copy",
    "Cut",
    "Paste",
    "Delete",
    "Zoom in",
    "Zoom out",
    "Notifications",
    "Help",
    "Keyboard shortcuts",
    "Settings",
  ]

  const filters = ["fuzzy", "contains", "startsWith", "words"] as const

  function words(item: { label: string }, query: string) {
    return query
      .toLowerCase()
      .split(/\s+/)
      .every((word) =>
        item.label
          .toLowerCase()
          .split(" ")
          .some((part) => part.startsWith(word)),
      )
  }

  let mode = $state<(typeof filters)[number]>("fuzzy")
</script>

<div data-slot="stack">
  <div data-slot="row">
    {#each filters as name (name)}
      <button type="button" aria-pressed={mode === name} onclick={() => (mode = name)}>
        {name}
      </button>
    {/each}
  </div>
  <Command filter={mode === "words" ? words : mode}>
    <CommandInput aria-label="Search commands" placeholder="Try “nf” or “zo in”" />
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandList>
      {#each commands as label (label)}
        <CommandItem value={label}>
          {label}
        </CommandItem>
      {/each}
    </CommandList>
  </Command>
</div>
