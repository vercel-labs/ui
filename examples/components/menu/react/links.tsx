"use client"

import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import { CornerDownLeftIcon } from "lucide-react"

const sections = [
  { href: "#composition", label: "Composition" },
  { href: "#styling", label: "Styling" },
  { href: "#api-reference", label: "API reference" },
]

function Example() {
  return (
    <Menu>
      <MenuTrigger>Links</MenuTrigger>
      <MenuContent>
        {sections.map((section) => (
          <MenuItem
            key={section.href}
            render={(props) => (
              <a {...props} href={section.href}>
                {props.children}
                <CornerDownLeftIcon aria-hidden="true" />
              </a>
            )}
          >
            {section.label}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  )
}

export { Example }
