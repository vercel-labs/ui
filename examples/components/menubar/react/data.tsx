"use client"

import * as React from "react"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemIndicator,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  type MenuData,
  type MenuDataItem,
} from "@ui-sdk/react/menu"
import { Menubar } from "@ui-sdk/react/menubar"
import { CheckIcon, ChevronRightIcon } from "lucide-react"

const file: MenuData = [
  { value: "new", label: "New File", shortcut: "mod+alt+n" },
  { value: "open", label: "Open…" },
  { type: "separator" },
  { type: "submenu", label: "Share", items: [{ value: "email", label: "Email link" }] },
]
const view: MenuData = [
  { type: "checkbox", value: "minimap", label: "Minimap", defaultChecked: true },
  { type: "checkbox", value: "wrap", label: "Word Wrap" },
]

function MenuEntries({ items }: { items: MenuData }) {
  return items.map((entry, index) => {
    const item: MenuDataItem = typeof entry === "string" ? { value: entry, label: entry } : entry
    switch (item.type) {
      case undefined:
      case "item":
        return (
          <MenuItem key={item.value} value={item.value} shortcut={item.shortcut}>
            {item.label}
          </MenuItem>
        )
      case "separator":
        return <MenuSeparator key={`separator-${index}`} />
      case "checkbox":
        return (
          <MenuCheckboxItem key={item.value} value={item.value} defaultChecked={item.defaultChecked}>
            <MenuItemIndicator>
              <CheckIcon aria-hidden="true" />
            </MenuItemIndicator>
            {item.label}
          </MenuCheckboxItem>
        )
      case "submenu":
        return (
          <MenuSub key={`submenu-${index}`}>
            <MenuSubTrigger>
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
  const [last, setLast] = React.useState("nothing yet")
  return (
    <div data-slot="stack">
      <Menubar>
        <Menu items={file} onAction={setLast}>
          <MenuTrigger>File</MenuTrigger>
          <MenuContent>
            <MenuEntries items={file} />
          </MenuContent>
        </Menu>
        <Menu
          items={view}
          onCheckedChange={(checked, { value }) => setLast(`${value} ${checked ? "on" : "off"}`)}
        >
          <MenuTrigger>View</MenuTrigger>
          <MenuContent>
            <MenuEntries items={view} />
          </MenuContent>
        </Menu>
      </Menubar>
      <output data-slot="output">Last: {last}</output>
    </div>
  )
}

export { Example }
