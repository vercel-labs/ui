"use client"

import * as React from "react"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { ChevronRightIcon } from "lucide-react"

function Example() {
  const [status, setStatus] = React.useState("Closed")

  return (
    <div data-slot="stack">
      <Menu
        onOpenChange={(open) => setStatus(open ? "Opening" : "Closing")}
        onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
      >
        <MenuTrigger>Animated</MenuTrigger>
        <MenuContent keepMounted>
          <MenuItem>Back</MenuItem>
          <MenuItem>Forward</MenuItem>
          <MenuItem>Reload</MenuItem>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger>
              More tools
              <ChevronRightIcon aria-hidden="true" />
            </MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>Save page as…</MenuItem>
              <MenuItem>Developer tools</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
      <output data-slot="output">{status}</output>
    </div>
  )
}

export { Example }
