import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { createMenubarController, Menubar } from "@ui-sdk/solid/menubar"
import { useShortcut } from "@ui-sdk/solid/shortcuts"
import { createSignal, For } from "solid-js"

function Example() {
  const menubar = createMenubarController()
  const [open, setOpen] = createSignal("none")
  useShortcut("alt+m", () => menubar.focus())
  return (
    <div data-slot="stack">
      <Menubar controller={menubar}>
        <For each={["File", "Edit"]}>
          {(label) => (
            <Menu onOpenChange={(next) => setOpen(next ? label : "none")}>
              <MenuTrigger>{label}</MenuTrigger>
              <MenuContent>
                <MenuItem closeOnSelect={false} onSelect={() => menubar.close()}>
                  Close from the controller
                </MenuItem>
              </MenuContent>
            </Menu>
          )}
        </For>
      </Menubar>
      <div data-slot="row">
        <button type="button" onClick={() => menubar.focus()}>
          Focus menubar
        </button>
        <output data-slot="output">Open: {open()} · Alt+M focuses it too</output>
      </div>
    </div>
  )
}

export { Example }
