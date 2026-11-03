import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { ChevronRightIcon } from "lucide-react"

const menus = [
  { name: "Instant", delay: 0 },
  { name: "Default", delay: 100 },
  { name: "Slow", delay: 500 },
]

const submenus = [
  { label: "Open recent", items: ["report.pdf", "notes.md"] },
  { label: "Share", items: ["Email", "Copy link"] },
]

function Example() {
  return (
    <div data-slot="row">
      {menus.map(({ name, delay }) => (
        <Menu key={name} delay={delay}>
          <MenuTrigger>{name}</MenuTrigger>
          <MenuContent>
            <MenuItem>New file</MenuItem>
            {submenus.map((submenu) => (
              <MenuSub key={submenu.label}>
                <MenuSubTrigger>
                  {submenu.label}
                  <ChevronRightIcon aria-hidden="true" />
                </MenuSubTrigger>
                <MenuSubContent>
                  {submenu.items.map((label) => (
                    <MenuItem key={label}>{label}</MenuItem>
                  ))}
                </MenuSubContent>
              </MenuSub>
            ))}
            <MenuItem>Close</MenuItem>
          </MenuContent>
        </Menu>
      ))}
    </div>
  )
}

export { Example }
