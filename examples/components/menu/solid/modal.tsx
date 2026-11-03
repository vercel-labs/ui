import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { createSignal } from "solid-js"

function Example() {
  const [clicks, setClicks] = createSignal(0)

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <Menu modal="pointer">
          <MenuTrigger>Default</MenuTrigger>
          <MenuContent>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Duplicate</MenuItem>
          </MenuContent>
        </Menu>
        <Menu modal>
          <MenuTrigger>Modal</MenuTrigger>
          <MenuContent>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Duplicate</MenuItem>
          </MenuContent>
        </Menu>
        <Menu modal={false}>
          <MenuTrigger>Non-modal</MenuTrigger>
          <MenuContent>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Duplicate</MenuItem>
          </MenuContent>
        </Menu>
      </div>
      <button onClick={() => setClicks(clicks() + 1)}>
        Clicked {clicks()} {clicks() === 1 ? "time" : "times"}. Open a menu, then click here.
      </button>
    </div>
  )
}

export { Example }
