<script lang="ts">
  import { SearchIcon } from "@lucide/svelte"
  import type { ListAnnouncement } from "@ui-sdk/core/command"
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandGroupLabel,
    CommandInput,
    CommandItem,
    CommandItemText,
    CommandList,
    type CommandData,
  } from "@ui-sdk/svelte/command"

  const commands: CommandData = [
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

  const suggested: CommandData = [
    { type: "group", label: "Suggested", items: ["New file", "Settings", "Help"] },
  ]

  const announcement = (change: ListAnnouncement) =>
    change.type === "results" ? `${change.count} commands` : null
</script>

<Command items={commands} emptyItems={suggested} {announcement}>
  <div data-slot="row">
    <SearchIcon aria-hidden="true" />
    <CommandInput aria-label="Search commands" placeholder="Search commands…" />
  </div>
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    {#snippet children(state)}
      {#each (state.items as (string | { label: string; items: string[] })[]) as entry (typeof entry === "string" ? entry : entry.label)}
        {#if typeof entry === "string"}
          <CommandItem value={entry}>
            <CommandItemText />
          </CommandItem>
        {:else}
          <CommandGroup>
            <CommandGroupLabel>{entry.label}</CommandGroupLabel>
            {#each entry.items as command (command)}
              <CommandItem value={command}>
                <CommandItemText />
              </CommandItem>
            {/each}
          </CommandGroup>
        {/if}
      {/each}
    {/snippet}
  </CommandList>
</Command>
