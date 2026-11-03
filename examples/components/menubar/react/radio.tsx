import {
  Menu,
  MenuContent,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { Menubar } from "@ui-sdk/react/menubar"
import * as React from "react"

const profiles = [
  { value: "andy", label: "Andy" },
  { value: "benoit", label: "Benoit" },
  { value: "luis", label: "Luis" },
]

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

export function Example() {
  const [theme, setTheme] = React.useState("system")
  return (
    <div data-slot="stack">
      <Menubar>
        <Menu>
          <MenuTrigger>Profiles</MenuTrigger>
          <MenuContent>
            <MenuRadioGroup defaultValue="benoit">
              {profiles.map((profile) => (
                <MenuRadioItem key={profile.value} value={profile.value}>
                  <MenuItemIndicator />
                  {profile.label}
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger>Theme</MenuTrigger>
          <MenuContent>
            <MenuRadioGroup value={theme} onValueChange={setTheme}>
              {themes.map((option) => (
                <MenuRadioItem key={option.value} value={option.value}>
                  <MenuItemIndicator />
                  {option.label}
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
      </Menubar>
      <output data-slot="output">Theme: {theme}</output>
    </div>
  )
}
