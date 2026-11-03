<script lang="ts">
  import { CalculatorIcon, CalendarIcon, CreditCardIcon, SettingsIcon, SmileIcon, UserIcon } from "@lucide/svelte"
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandGroupLabel,
    CommandInput,
    CommandItem,
    CommandItemIcon,
    CommandList,
    CommandSeparator,
  } from "@ui-sdk/svelte/command"

  const groups = [
    {
      label: "Suggestions",
      items: [
        { value: "calendar", label: "Calendar", icon: CalendarIcon },
        { value: "emoji", label: "Search Emoji", icon: SmileIcon },
        { value: "calculator", label: "Calculator", icon: CalculatorIcon },
      ],
    },
    {
      label: "Settings",
      items: [
        { value: "profile", label: "Profile", icon: UserIcon },
        { value: "billing", label: "Billing", icon: CreditCardIcon },
        { value: "settings", label: "Settings", icon: SettingsIcon },
      ],
    },
  ]
</script>

<Command>
  <CommandInput aria-label="Search commands" placeholder="Type a command or search..." />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    {#each groups as group, index (group.label)}
      {#if index > 0}<CommandSeparator />{/if}
      <CommandGroup>
        <CommandGroupLabel>{group.label}</CommandGroupLabel>
        {#each group.items as item (item.value)}
          <CommandItem value={item.value}>
            <CommandItemIcon>
              <item.icon />
            </CommandItemIcon>
            {item.label}
          </CommandItem>
        {/each}
      </CommandGroup>
    {/each}
  </CommandList>
</Command>
