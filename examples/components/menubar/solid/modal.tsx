import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { Menubar } from "@ui-sdk/solid/menubar"
import { For } from "solid-js"

function Example() {
  return (
    <Menubar modal>
      <For each={["File", "Edit", "View"]}>
        {(label) => (
          <Menu>
            <MenuTrigger>{label}</MenuTrigger>
            <MenuContent>
              <MenuItem>{label} settings</MenuItem>
            </MenuContent>
          </Menu>
        )}
      </For>
    </Menubar>
  )
}

export { Example }
