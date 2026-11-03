<script lang="ts">
  import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@ui-sdk/svelte/command"

  const commands = [
    { value: "calendar", label: "Calendar" },
    { value: "emoji", label: "Search Emoji", keywords: ["smiley", "face"] },
    { value: "calculator", label: "Calculator" },
  ]
</script>

<Command>
  <CommandInput aria-label="Search commands" placeholder="Try “smiley”" />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    {#each commands as item (item.value)}
      <CommandItem value={item.value} label={item.label} keywords={item.keywords}>
        <strong>{item.label}</strong>
      </CommandItem>
    {/each}
  </CommandList>
</Command>
