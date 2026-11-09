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
} from "@ui-sdk/react/menu"
import * as React from "react"
import { createRoot } from "react-dom/client"

function Fixture() {
  const [action, setAction] = React.useState("")
  const [selections, setSelections] = React.useState(0)
  const [align, setAlign] = React.useState("left")
  const [open, setOpen] = React.useState(false)
  // Specs close the controlled menu from outside it.
  ;(window as unknown as { __closeControlled: () => void }).__closeControlled =
    () => setOpen(false)
  return (
    <div className="fixture">
      <button>Before</button>
      <Menu onAction={setAction}>
        <MenuTrigger>Edit</MenuTrigger>
        <MenuContent className="popup">
          <MenuItem
            className="item"
            value="pin"
            onSelect={(event) => {
              event.preventDefault()
              setSelections((count) => count + 1)
            }}
          >
            Pin
          </MenuItem>
          <MenuItem className="item" value="zoom" closeOnSelect={false}>
            Zoom in
          </MenuItem>
          <MenuItem className="item" value="erase" shortcut="mod+backspace">
            Erase
          </MenuItem>
          <MenuItem className="item" value="window" shortcut="alt+n">
            New window
          </MenuItem>
          <MenuSeparator className="separator" />
          <MenuCheckboxItem className="item" value="autosave" closeOnSelect>
            Autosave
          </MenuCheckboxItem>
          <MenuCheckboxItem className="item" value="pinned" checked>
            Pinned
          </MenuCheckboxItem>
          <MenuRadioGroup value={align} onValueChange={setAlign}>
            <MenuGroupLabel className="label">Align</MenuGroupLabel>
            <MenuRadioItem className="item" value="left">
              Left
            </MenuRadioItem>
            <MenuRadioItem className="item" value="right">
              Right
            </MenuRadioItem>
          </MenuRadioGroup>
          <MenuSub>
            <MenuSubTrigger className="item" disabled>
              Share
            </MenuSubTrigger>
            <MenuSubContent className="popup">
              <MenuItem className="item" value="email">
                Email
              </MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSub loop={false}>
            <MenuSubTrigger className="item">More</MenuSubTrigger>
            <MenuSubContent className="popup">
              <MenuItem className="item" value="first">
                First
              </MenuItem>
              <MenuItem className="item" value="last">
                Last
              </MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger>Offsets</MenuTrigger>
        <MenuContent
          className="popup"
          sideOffset={8}
          alignOffset={-4}
          collisionPadding={24}
        >
          <MenuItem className="item" value="one">
            One
          </MenuItem>
          <MenuItem className="item" value="two">
            Two
          </MenuItem>
        </MenuContent>
      </Menu>
      <Menu open={open} onOpenChange={setOpen}>
        <MenuTrigger>Controlled</MenuTrigger>
        <MenuContent className="popup">
          <MenuItem
            className="item"
            value="done"
            onSelect={(event) => {
              event.preventDefault()
              setOpen(false)
            }}
          >
            Done
          </MenuItem>
          <MenuItem className="item" value="later">
            Later
          </MenuItem>
        </MenuContent>
      </Menu>
      <button onClick={() => setAlign("right")}>Align right</button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Selections">
        {selections}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
