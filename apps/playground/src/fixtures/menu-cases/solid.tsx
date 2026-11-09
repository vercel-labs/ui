import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"

function Fixture() {
  const [action, setAction] = createSignal("")
  const [selections, setSelections] = createSignal(0)
  const [align, setAlign] = createSignal("left")
  const [open, setOpen] = createSignal(false)
  // Specs close the controlled menu from outside it.
  ;(window as unknown as { __closeControlled: () => void }).__closeControlled =
    () => setOpen(false)
  return (
    <div class="fixture">
      <button>Before</button>
      <Menu onAction={setAction}>
        <MenuTrigger>Edit</MenuTrigger>
        <MenuContent class="popup">
          <MenuItem
            class="item"
            value="pin"
            onSelect={(event) => {
              event.preventDefault()
              setSelections((count) => count + 1)
            }}
          >
            Pin
          </MenuItem>
          <MenuItem class="item" value="zoom" closeOnSelect={false}>
            Zoom in
          </MenuItem>
          <MenuItem class="item" value="erase" shortcut="mod+backspace">
            Erase
          </MenuItem>
          <MenuItem class="item" value="window" shortcut="alt+n">
            New window
          </MenuItem>
          <MenuSeparator class="separator" />
          <MenuCheckboxItem class="item" value="autosave" closeOnSelect>
            Autosave
          </MenuCheckboxItem>
          <MenuCheckboxItem class="item" value="pinned" checked>
            Pinned
          </MenuCheckboxItem>
          <MenuRadioGroup value={align()} onValueChange={setAlign}>
            <MenuGroupLabel class="label">Align</MenuGroupLabel>
            <MenuRadioItem class="item" value="left">
              Left
            </MenuRadioItem>
            <MenuRadioItem class="item" value="right">
              Right
            </MenuRadioItem>
          </MenuRadioGroup>
          <MenuSub>
            <MenuSubTrigger class="item" disabled>
              Share
            </MenuSubTrigger>
            <MenuSubContent class="popup">
              <MenuItem class="item" value="email">
                Email
              </MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSub loop={false}>
            <MenuSubTrigger class="item">More</MenuSubTrigger>
            <MenuSubContent class="popup">
              <MenuItem class="item" value="first">
                First
              </MenuItem>
              <MenuItem class="item" value="last">
                Last
              </MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger>Offsets</MenuTrigger>
        <MenuContent
          class="popup"
          sideOffset={8}
          alignOffset={-4}
          collisionPadding={24}
        >
          <MenuItem class="item" value="one">
            One
          </MenuItem>
          <MenuItem class="item" value="two">
            Two
          </MenuItem>
        </MenuContent>
      </Menu>
      <Menu open={open()} onOpenChange={setOpen}>
        <MenuTrigger>Controlled</MenuTrigger>
        <MenuContent class="popup">
          <MenuItem
            class="item"
            value="done"
            onSelect={(event) => {
              event.preventDefault()
              setOpen(false)
            }}
          >
            Done
          </MenuItem>
          <MenuItem class="item" value="later">
            Later
          </MenuItem>
        </MenuContent>
      </Menu>
      <button onClick={() => setAlign("right")}>Align right</button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Selections">
        {selections()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
