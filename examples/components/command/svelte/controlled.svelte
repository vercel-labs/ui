<script lang="ts">
  import { Command, CommandInput, CommandItem, CommandList, CommandPage } from "@ui-sdk/svelte/command"

  const themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]

  let value = $state<string | null>("dark")
  let query = $state("")
  let pages = $state(["theme"])
  let reason = $state("")
</script>

<div data-slot="stack">
  <Command
    bind:value
    bind:query
    bind:pages
    onValueChange={(_next: string | null, details: { reason: string }) => (reason = details.reason)}
  >
    <CommandInput aria-label="Search themes" placeholder="Search themes..." />
    <CommandList>
      <CommandPage>
        <CommandItem value="theme" page="theme">Change theme…</CommandItem>
      </CommandPage>
      <CommandPage value="theme">
        {#each themes as theme (theme.value)}
          <CommandItem value={theme.value}>
            {theme.label}
          </CommandItem>
        {/each}
      </CommandPage>
    </CommandList>
  </Command>
  <output data-slot="output">
    Highlighted {value ?? "nothing"} ({reason || "start"}), text “{query}”, pages [{pages.join(", ")}]
  </output>
  <Command defaultValue="system" defaultQuery="s" defaultPages={[]} debug>
    <CommandInput aria-label="Search themes, uncontrolled" />
    <CommandList>
      {#each themes as theme (theme.value)}
        <CommandItem value={theme.value}>
          {theme.label}
        </CommandItem>
      {/each}
    </CommandList>
  </Command>
</div>
