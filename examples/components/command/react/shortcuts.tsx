"use client"

import {
  Command,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandList,
  CommandShortcut,
} from "@ui-sdk/react/command"
import { CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react"
import * as React from "react"

const settings = [
  { value: "profile", label: "Profile", icon: UserIcon, shortcut: "mod+p" },
  { value: "billing", label: "Billing", icon: CreditCardIcon, shortcut: "mod+b" },
  { value: "settings", label: "Settings", icon: SettingsIcon, shortcut: "mod+s" },
]

function Example() {
  const [ran, setRan] = React.useState("")
  return (
    <div data-slot="stack">
      <Command onAction={setRan}>
        <CommandInput aria-label="Search settings" placeholder="Search settings..." />
        <CommandList>
          <CommandGroup>
            <CommandGroupLabel>Settings</CommandGroupLabel>
            {settings.map((item) => (
              <CommandItem key={item.value} value={item.value} shortcut={item.shortcut}>
                <CommandItemIcon>
                  <item.icon />
                </CommandItemIcon>
                <span>{item.label}</span>
                <CommandShortcut>{(state) => state.text}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <output data-slot="output">{ran ? `Ran ${ran}` : "Try a shortcut"}</output>
    </div>
  )
}

export { Example }
