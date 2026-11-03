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
import { Check, ChevronRight, Circle } from "lucide-react"

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
            className="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground"
          >
            {item.label}
          </MenuItem>
        )
      case "separator":
        return <MenuSeparator key={`separator-${index}`} className="-mx-1 my-1 h-px bg-border/50" />
      case "group":
        return (
          <MenuGroup key={`group-${index}`}>
            {item.label && (
              <MenuGroupLabel className="py-1 ps-8 pe-2 text-xs text-muted-foreground">
                {item.label}
              </MenuGroupLabel>
            )}
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
            className="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground"
          >
            <MenuItemIndicator className="invisible absolute start-2 flex w-4 justify-center group-data-checked:visible">
              <Check aria-hidden="true" className="size-4" />
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
            {item.label && (
              <MenuGroupLabel className="py-1 ps-8 pe-2 text-xs text-muted-foreground">
                {item.label}
              </MenuGroupLabel>
            )}
            {item.items.map((radio) => (
              <MenuRadioItem
                key={radio.value}
                value={radio.value}
                disabled={radio.disabled}
                className="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground"
              >
                <MenuItemIndicator className="invisible absolute start-2 flex w-4 justify-center group-data-checked:visible">
                  <Circle aria-hidden="true" className="size-2 fill-current" />
                </MenuItemIndicator>
                {radio.label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        )
      case "submenu":
        return (
          <MenuSub key={`submenu-${index}`}>
            <MenuSubTrigger
              disabled={item.disabled}
              className="group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-8 pe-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-open:bg-accent data-open:text-accent-foreground"
            >
              {item.label}
              <ChevronRight
                aria-hidden="true"
                className="size-4 ms-auto text-muted-foreground rtl:rotate-180"
              />
            </MenuSubTrigger>
            <MenuSubContent className="min-w-56 max-h-(--available-height) overflow-y-auto origin-(--transform-origin) rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 **:data-[slot=menu-shortcut]:ms-auto **:data-[slot=menu-shortcut]:ps-4 **:data-[slot=menu-shortcut]:text-xs **:data-[slot=menu-shortcut]:tracking-widest **:data-[slot=menu-shortcut]:text-muted-foreground motion-reduce:transition-none">
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
    <>
      <Menu
        items={fileMenu}
        itemShortcuts
        onAction={(value) => setStatus(`Ran ${value}`)}
        onCheckedChange={(checked, details) => setStatus(`${details.value} ${checked ? "on" : "off"}`)}
        onValueChange={(value, details) => setStatus(`${details.group}: ${value}`)}
      >
        <MenuTrigger className="inline-flex cursor-default h-8 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-border bg-background bg-clip-padding px-3 text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted data-open:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none">
          File
        </MenuTrigger>
        <MenuContent className="min-w-56 max-h-(--available-height) overflow-y-auto origin-(--transform-origin) rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 **:data-[slot=menu-shortcut]:ms-auto **:data-[slot=menu-shortcut]:ps-4 **:data-[slot=menu-shortcut]:text-xs **:data-[slot=menu-shortcut]:tracking-widest **:data-[slot=menu-shortcut]:text-muted-foreground motion-reduce:transition-none">
          <MenuEntries items={fileMenu} />
        </MenuContent>
      </Menu>
      <output className="mt-3 text-sm text-muted-foreground block min-h-5">
        {status || "Try the menu, or press its shortcuts while it's closed"}
      </output>
    </>
  )
}

export { Example }
