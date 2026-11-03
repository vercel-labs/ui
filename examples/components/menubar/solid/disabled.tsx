import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { Menubar } from "@ui-sdk/solid/menubar"
import { For } from "solid-js"

function Example() {
  return (
    <div data-slot="stack">
      <Menubar>
        <Menu>
          <MenuTrigger>File</MenuTrigger>
          <MenuContent>
            <MenuItem>New File</MenuItem>
            <MenuItem disabled>Revert File</MenuItem>
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger disabled>Share</MenuTrigger>
          <MenuContent>
            <MenuItem>Email link</MenuItem>
          </MenuContent>
        </Menu>
      </Menubar>
      <Menubar disabled>
        <For each={["Edit", "View"]}>
          {(label) => (
            <Menu>
              <MenuTrigger>{label}</MenuTrigger>
              <MenuContent>
                <MenuItem>Unavailable</MenuItem>
              </MenuContent>
            </Menu>
          )}
        </For>
      </Menubar>
    </div>
  )
}

export { Example }
