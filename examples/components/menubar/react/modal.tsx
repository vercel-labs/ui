import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import { Menubar } from "@ui-sdk/react/menubar"

function Example() {
  return (
    <Menubar modal>
      {["File", "Edit", "View"].map((label) => (
        <Menu key={label}>
          <MenuTrigger>{label}</MenuTrigger>
          <MenuContent>
            <MenuItem>{label} settings</MenuItem>
          </MenuContent>
        </Menu>
      ))}
    </Menubar>
  )
}

export { Example }
