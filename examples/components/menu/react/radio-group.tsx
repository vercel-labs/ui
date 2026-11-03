"use client"

import * as React from "react"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/react/menu"

function Example() {
  const [position, setPosition] = React.useState("bottom")

  return (
    <div data-slot="stack">
      <Menu>
        <MenuTrigger>Panel</MenuTrigger>
        <MenuContent>
          <MenuRadioGroup name="position" value={position} onValueChange={setPosition}>
            <MenuGroupLabel>Position</MenuGroupLabel>
            {["Top", "Bottom", "Right"].map((option) => (
              <MenuRadioItem key={option} value={option.toLowerCase()}>
                <MenuItemIndicator />
                {option}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
          <MenuSeparator />
          <MenuRadioGroup defaultValue="comfortable">
            <MenuGroupLabel>Density</MenuGroupLabel>
            {["Compact", "Comfortable"].map((option) => (
              <MenuRadioItem key={option} value={option.toLowerCase()}>
                <MenuItemIndicator />
                {option}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
      <output data-slot="output">Panel at the {position}</output>
    </div>
  )
}

export { Example }
