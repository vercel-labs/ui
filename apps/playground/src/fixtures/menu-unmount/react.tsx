import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import * as React from "react"
import { createRoot } from "react-dom/client"

function Fixture() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="fixture">
      <button>Before</button>
      <Menu open={open} onOpenChange={setOpen}>
        <MenuTrigger>Actions</MenuTrigger>
        {open && (
          <MenuContent className="popup fill-in">
            <MenuItem className="item" value="rename">
              Rename
            </MenuItem>
            <MenuItem className="item" value="delete">
              Delete
            </MenuItem>
          </MenuContent>
        )}
      </Menu>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
