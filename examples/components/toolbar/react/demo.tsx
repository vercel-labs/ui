"use client"

import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/react/toolbar"
import { BoldIcon, ChevronDownIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

function Example() {
  return (
    <Toolbar aria-label="Formatting">
      <ToggleGroup multiple aria-label="Text style">
        <Toggle data-variant="ghost" value="bold" aria-label="Bold">
          <BoldIcon />
        </Toggle>
        <Toggle data-variant="ghost" value="italic" aria-label="Italic">
          <ItalicIcon />
        </Toggle>
        <Toggle data-variant="ghost" value="underline" aria-label="Underline">
          <UnderlineIcon />
        </Toggle>
      </ToggleGroup>
      <ToolbarSeparator />
      <Menu>
        <ToolbarButton data-variant="secondary" render={<MenuTrigger />}>
          Sans
          <ChevronDownIcon />
        </ToolbarButton>
        <MenuContent>
          {["Sans", "Serif", "Mono"].map((font) => (
            <MenuItem key={font}>{font}</MenuItem>
          ))}
        </MenuContent>
      </Menu>
    </Toolbar>
  )
}

export { Example }
