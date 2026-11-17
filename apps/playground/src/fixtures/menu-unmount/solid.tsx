import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { render } from "@solidjs/web"
import { createSignal, Show } from "solid-js"

function Fixture() {
  const [open, setOpen] = createSignal(false)
  return (
    <div class="fixture">
      <button>Before</button>
      <Menu open={open()} onOpenChange={setOpen}>
        <MenuTrigger>Actions</MenuTrigger>
        <Show when={open()}>
          <MenuContent class="popup fill-in">
            <MenuItem class="item" value="rename">
              Rename
            </MenuItem>
            <MenuItem class="item" value="delete">
              Delete
            </MenuItem>
          </MenuContent>
        </Show>
      </Menu>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
