<script lang="ts">
  import { Command, CommandInput, CommandItem, CommandList } from "@ui-sdk/svelte/command"

  const commands = ["Home", "Inbox", "Documents", "Downloads", "Pictures", "Music", "New file", "New folder"]
</script>

<Command autoHighlight={false} loop={false}>
  <CommandInput aria-label="Search commands" placeholder="Type, then press ArrowDown" />
  <CommandList>
    {#each commands as label (label)}
      <CommandItem value={label}>
        {label}
      </CommandItem>
    {/each}
  </CommandList>
</Command>
