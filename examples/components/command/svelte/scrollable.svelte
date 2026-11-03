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
</script>

<Command>
  <CommandInput aria-label="Search commands" placeholder="Search..." />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    {#each commands as label (label)}
      <CommandItem value={label}>
        {label}
      </CommandItem>
    {/each}
  </CommandList>
</Command>
