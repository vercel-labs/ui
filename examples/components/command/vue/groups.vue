<script setup lang="ts">
import { CalculatorIcon, CalendarIcon, CreditCardIcon, SettingsIcon, SmileIcon, UserIcon } from "@lucide/vue"
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
} from "@ui-sdk/vue/command"

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

<template>
  <Command>
    <CommandInput aria-label="Search commands" placeholder="Type a command or search..." />
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandList>
      <template v-for="(group, index) in groups" :key="group.label">
        <CommandSeparator v-if="index > 0" />
        <CommandGroup>
          <CommandGroupLabel>{{ group.label }}</CommandGroupLabel>
          <CommandItem v-for="item in group.items" :key="item.value" :value="item.value">
            <CommandItemIcon>
              <component :is="item.icon" />
            </CommandItemIcon>
            {{ item.label }}
          </CommandItem>
        </CommandGroup>
      </template>
    </CommandList>
  </Command>
</template>
