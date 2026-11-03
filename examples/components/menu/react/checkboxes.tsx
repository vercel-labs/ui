"use client"

import * as React from "react"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { CheckIcon } from "lucide-react"

function Example() {
  const [statusBar, setStatusBar] = React.useState(true)
  const [minimap, setMinimap] = React.useState(false)

  return (
    <div data-slot="stack">
      <Menu>
        <MenuTrigger>View</MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>Appearance</MenuGroupLabel>
            <MenuCheckboxItem value="status-bar" checked={statusBar} onCheckedChange={setStatusBar}>
              <MenuItemIndicator keepMounted>
                <CheckIcon aria-hidden="true" />
              </MenuItemIndicator>
              Status bar
            </MenuCheckboxItem>
            <MenuCheckboxItem value="minimap" checked={minimap} onCheckedChange={setMinimap}>
              <MenuItemIndicator keepMounted>
                <CheckIcon aria-hidden="true" />
              </MenuItemIndicator>
              Minimap
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuCheckboxItem value="line-numbers" defaultChecked>
            <MenuItemIndicator keepMounted>
              <CheckIcon aria-hidden="true" />
            </MenuItemIndicator>
            Line numbers
          </MenuCheckboxItem>
          <MenuCheckboxItem value="word-wrap">
            <MenuItemIndicator keepMounted>
              <CheckIcon aria-hidden="true" />
            </MenuItemIndicator>
            Word wrap
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
      <output data-slot="output">
        Status bar {statusBar ? "shown" : "hidden"}, minimap {minimap ? "shown" : "hidden"}
      </output>
    </div>
  )
}

export { Example }
