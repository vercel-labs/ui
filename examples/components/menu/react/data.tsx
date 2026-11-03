"use client"

import * as React from "react"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  type MenuData,
  type MenuDataItem,
} from "@ui-sdk/react/menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

const fileMenu: MenuData = [
  { value: "quick-open", label: "Quick open…", shortcut: "mod+p" },
  { value: "open", label: "Open…", shortcut: "mod+o" },
  { value: "save", label: "Save", shortcut: "mod+s", disabled: true },
  { type: "separator" },
  {
    type: "group",
    label: "Show",
    items: [
      { type: "checkbox", value: "toolbar", label: "Toolbar", defaultChecked: true },
      { type: "checkbox", value: "status", label: "Status bar", closeOnSelect: true },
    ],
  },
  {
    type: "radio-group",
    name: "sort",
    label: "Sort by",
    defaultValue: "name",
    items: [
      { value: "name", label: "Name" },
      { value: "date", label: "Date modified" },
      { value: "size", label: "Size", disabled: true },
    ],
  },
  { type: "separator" },
  {
    type: "submenu",
    label: "Share",
    items: [
      { value: "email", label: "Email" },
      { value: "link", label: "Copy link", closeOnSelect: false },
    ],
  },
  { type: "submenu", label: "Move to", disabled: true, items: [{ value: "archive", label: "Archive" }] },
  { type: "separator" },
  { value: "delete", label: "Delete", destructive: true },
]

function MenuEntries({ items }: { items: MenuData }) {
  return items.map((entry, index) => {
    const item: MenuDataItem = typeof entry === "string" ? { value: entry, label: entry } : entry
    switch (item.type) {
      case undefined:
      case "item":
        return (
          <MenuItem
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            shortcut={item.shortcut}
            closeOnSelect={item.closeOnSelect}
            destructive={item.destructive}
          >
            {item.label}
          </MenuItem>
        )
      case "separator":
        return <MenuSeparator key={`separator-${index}`} />
      case "group":
        return (
          <MenuGroup key={`group-${index}`}>
            {item.label && <MenuGroupLabel>{item.label}</MenuGroupLabel>}
            <MenuEntries items={item.items} />
          </MenuGroup>
        )
      case "checkbox":
        return (
          <MenuCheckboxItem
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            checked={item.checked}
            defaultChecked={item.defaultChecked}
            closeOnSelect={item.closeOnSelect}
          >
            <MenuItemIndicator>
              <CheckIcon aria-hidden="true" />
            </MenuItemIndicator>
            {item.label}
          </MenuCheckboxItem>
        )
      case "radio-group":
        return (
          <MenuRadioGroup
            key={item.name}
            name={item.name}
            value={item.value}
            defaultValue={item.defaultValue}
          >
            {item.label && <MenuGroupLabel>{item.label}</MenuGroupLabel>}
            {item.items.map((radio) => (
              <MenuRadioItem key={radio.value} value={radio.value} disabled={radio.disabled}>
                <MenuItemIndicator>
                  <CircleIcon aria-hidden="true" />
                </MenuItemIndicator>
                {radio.label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        )
      case "submenu":
        return (
          <MenuSub key={`submenu-${index}`}>
            <MenuSubTrigger disabled={item.disabled}>
              {item.label}
              <ChevronRightIcon aria-hidden="true" />
            </MenuSubTrigger>
            <MenuSubContent>
              <MenuEntries items={item.items} />
            </MenuSubContent>
          </MenuSub>
        )
    }
  })
}

function Example() {
  const [status, setStatus] = React.useState("")

  return (
    <div data-slot="stack">
      <Menu
        items={fileMenu}
        itemShortcuts
        onAction={(value) => setStatus(`Ran ${value}`)}
        onCheckedChange={(checked, details) => setStatus(`${details.value} ${checked ? "on" : "off"}`)}
        onValueChange={(value, details) => setStatus(`${details.group}: ${value}`)}
      >
        <MenuTrigger>File</MenuTrigger>
        <MenuContent>
          <MenuEntries items={fileMenu} />
        </MenuContent>
      </Menu>
      <output data-slot="output">{status || "Try the menu, or press its shortcuts while it's closed"}</output>
    </div>
  )
}

export { Example }
