"use client"

import * as React from "react"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import { createMenubarController, Menubar } from "@ui-sdk/react/menubar"
import { useShortcut } from "@ui-sdk/react/shortcuts"

function Example() {
  const [menubar] = React.useState(() => createMenubarController())
  const [open, setOpen] = React.useState("none")
  useShortcut("alt+m", () => menubar.focus())
  return (
    <div data-slot="stack">
      <Menubar controller={menubar}>
        {["File", "Edit"].map((label) => (
          <Menu key={label} onOpenChange={(next) => setOpen(next ? label : "none")}>
            <MenuTrigger>{label}</MenuTrigger>
            <MenuContent>
              <MenuItem closeOnSelect={false} onSelect={() => menubar.close()}>
                Close from the controller
              </MenuItem>
            </MenuContent>
          </Menu>
        ))}
      </Menubar>
      <div data-slot="row">
        <button type="button" onClick={() => menubar.focus()}>
          Focus menubar
        </button>
        <output data-slot="output">Open: {open} · Alt+M focuses it too</output>
      </div>
    </div>
  )
}

export { Example }
