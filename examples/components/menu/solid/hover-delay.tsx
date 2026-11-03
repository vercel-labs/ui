import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { For } from "solid-js"

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
      <For each={menus}>
        {({ name, delay }) => (
          <Menu delay={delay}>
            <MenuTrigger>{name}</MenuTrigger>
            <MenuContent>
              <MenuItem>New file</MenuItem>
              <For each={submenus}>
                {(submenu) => (
                  <MenuSub>
                    <MenuSubTrigger>
                      {submenu.label}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </MenuSubTrigger>
                    <MenuSubContent>
                      <For each={submenu.items}>{(label) => <MenuItem>{label}</MenuItem>}</For>
                    </MenuSubContent>
                  </MenuSub>
                )}
              </For>
              <MenuItem>Close</MenuItem>
            </MenuContent>
          </Menu>
        )}
      </For>
    </div>
  )
}

export { Example }
