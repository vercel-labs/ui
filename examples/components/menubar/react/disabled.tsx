import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import { Menubar } from "@ui-sdk/react/menubar"

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
        {["Edit", "View"].map((label) => (
          <Menu key={label}>
            <MenuTrigger>{label}</MenuTrigger>
            <MenuContent>
              <MenuItem>Unavailable</MenuItem>
            </MenuContent>
          </Menu>
        ))}
      </Menubar>
    </div>
  )
}

export { Example }
