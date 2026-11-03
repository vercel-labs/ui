<script lang="ts">
  import { CreditCardIcon, SettingsIcon, UserIcon } from "@lucide/svelte"
  import {
    Command,
    CommandGroup,
    CommandGroupLabel,
    CommandInput,
    CommandItem,
    CommandItemIcon,
    CommandList,
    CommandShortcut,
  } from "@ui-sdk/svelte/command"

  const settings = [
    { value: "profile", label: "Profile", icon: UserIcon, shortcut: "mod+p" },
    { value: "billing", label: "Billing", icon: CreditCardIcon, shortcut: "mod+b" },
    { value: "settings", label: "Settings", icon: SettingsIcon, shortcut: "mod+s" },
  ]

  let ran = $state("")

  function onAction(value: string) {
    ran = value
  }
</script>

<div data-slot="stack">
  <Command {onAction}>
    <CommandInput aria-label="Search settings" placeholder="Search settings..." />
    <CommandList>
      <CommandGroup>
        <CommandGroupLabel>Settings</CommandGroupLabel>
        {#each settings as item (item.value)}
          <CommandItem value={item.value} shortcut={item.shortcut}>
            <CommandItemIcon>
              <item.icon />
            </CommandItemIcon>
            <span>{item.label}</span>
            <CommandShortcut>
              {#snippet children(state)}{state.text}{/snippet}
            </CommandShortcut>
          </CommandItem>
        {/each}
      </CommandGroup>
    </CommandList>
  </Command>
  <output data-slot="output">{ran ? `Ran ${ran}` : "Try a shortcut"}</output>
</div>
