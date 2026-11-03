import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { createSignal } from "solid-js"

function Example() {
  const [statusBar, setStatusBar] = createSignal(true)
  const [minimap, setMinimap] = createSignal(false)

  return (
    <div data-slot="stack">
      <Menu>
        <MenuTrigger>View</MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>Appearance</MenuGroupLabel>
            <MenuCheckboxItem value="status-bar" checked={statusBar()} onCheckedChange={setStatusBar}>
              <MenuItemIndicator keepMounted>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </MenuItemIndicator>
              Status bar
            </MenuCheckboxItem>
            <MenuCheckboxItem value="minimap" checked={minimap()} onCheckedChange={setMinimap}>
              <MenuItemIndicator keepMounted>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </MenuItemIndicator>
              Minimap
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuCheckboxItem value="line-numbers" defaultChecked>
            <MenuItemIndicator keepMounted>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </MenuItemIndicator>
            Line numbers
          </MenuCheckboxItem>
          <MenuCheckboxItem value="word-wrap">
            <MenuItemIndicator keepMounted>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </MenuItemIndicator>
            Word wrap
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
      <output data-slot="output">
        Status bar {statusBar() ? "shown" : "hidden"}, minimap {minimap() ? "shown" : "hidden"}
      </output>
    </div>
  )
}

export { Example }
