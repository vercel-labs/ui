"use client"

import * as React from "react"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { CheckIcon, LogOutIcon, SettingsIcon, UserPlusIcon } from "lucide-react"

const accounts = [
  { value: "personal", name: "Riley Park", initials: "RP" },
  { value: "studio", name: "North Studio", initials: "NS" },
]

function Example() {
  const [account, setAccount] = React.useState("personal")
  const [action, setAction] = React.useState("")
  const current = accounts.find((option) => option.value === account)!

  return (
    <div data-slot="stack">
      <Menu onAction={setAction}>
        <MenuTrigger aria-label="Account">{current.initials}</MenuTrigger>
        <MenuContent align="end">
          <div data-slot="row">
            <span data-slot="badge">{current.initials}</span>
            <div data-slot="stack">
              <div>{current.name}</div>
              <div data-slot="hint">{current.value}@example.com</div>
            </div>
          </div>
          <MenuSeparator />
          <MenuRadioGroup value={account} onValueChange={setAccount}>
            <MenuGroupLabel>Switch account</MenuGroupLabel>
            {accounts.map((option) => (
              <MenuRadioItem key={option.value} value={option.value} closeOnSelect>
                <span data-slot="badge">{option.initials}</span>
                {option.name}
                <CheckIcon aria-hidden="true" />
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
          <MenuItem value="add-account">
            <UserPlusIcon aria-hidden="true" />
            Add account
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="settings">
            <SettingsIcon aria-hidden="true" />
            Settings
          </MenuItem>
          <MenuItem value="sign-out">
            <LogOutIcon aria-hidden="true" />
            Sign out
          </MenuItem>
        </MenuContent>
      </Menu>
      <output data-slot="output">{action ? `Ran ${action}` : `Signed in as ${current.name}`}</output>
    </div>
  )
}

export { Example }
