import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { createSignal } from "solid-js"

function Example() {
  const [status, setStatus] = createSignal("Closed")

  return (
    <div data-slot="stack">
      <Menu
        onOpenChange={(open) => setStatus(open ? "Opening" : "Closing")}
        onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
      >
        <MenuTrigger>Animated</MenuTrigger>
        <MenuContent keepMounted>
          <MenuItem>Back</MenuItem>
          <MenuItem>Forward</MenuItem>
          <MenuItem>Reload</MenuItem>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger>
              More tools
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
              <MenuItem>Save page as…</MenuItem>
              <MenuItem>Developer tools</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
      <output data-slot="output">{status()}</output>
    </div>
  )
}

export { Example }
