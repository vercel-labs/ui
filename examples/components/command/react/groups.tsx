"use client"

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
} from "@ui-sdk/react/command"
import { CalculatorIcon, CalendarIcon, CreditCardIcon, SettingsIcon, SmileIcon, UserIcon } from "lucide-react"
import * as React from "react"

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

function Example() {
  return (
    <Command>
      <CommandInput aria-label="Search commands" placeholder="Type a command or search..." />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {groups.map((group, index) => (
          <React.Fragment key={group.label}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup>
              <CommandGroupLabel>{group.label}</CommandGroupLabel>
              {group.items.map((item) => (
                <CommandItem key={item.value} value={item.value}>
                  <CommandItemIcon>
                    <item.icon />
                  </CommandItemIcon>
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </Command>
  )
}

export { Example }
