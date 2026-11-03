"use client"

import * as React from "react"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

const fonts = [
  "Inter",
  "Geist",
  "IBM Plex Sans",
  "Source Sans",
  "Work Sans",
  "Manrope",
  "DM Sans",
  "Figtree",
  "Outfit",
  "Lexend",
  "Nunito",
  "Rubik",
  "Karla",
  "Barlow",
  "Mulish",
  "Urbanist",
  "Sora",
  "Onest",
]

function Example() {
  const [font, setFont] = React.useState("Inter")

  return (
    <Menu>
      <MenuTrigger>
        {font}
        <ChevronDownIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuContent sideOffset={8} alignOffset={-4} collisionPadding={24}>
        <MenuRadioGroup value={font} onValueChange={setFont}>
          <MenuGroupLabel>Font</MenuGroupLabel>
          {fonts.map((name) => (
            <MenuRadioItem key={name} value={name} closeOnSelect>
              <MenuItemIndicator>
                <CheckIcon aria-hidden="true" />
              </MenuItemIndicator>
              {name}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  )
}

export { Example }
