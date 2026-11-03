import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { For } from "solid-js"

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
        <For each={sections}>
          {(section) => (
            <MenuItem
              render={(props) => (
                <a {...props} href={section.href}>
                  {props.children}

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                    <path d="m9 10-5 5 5 5" />
                  </svg>
                </a>
              )}
            >
              {section.label}
            </MenuItem>
          )}
        </For>
      </MenuContent>
    </Menu>
  )
}

export { Example }
