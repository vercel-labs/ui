import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { onItemsChange } from "tests/fixtures/items.ts"
import { changedMenuGroups, menuGroups } from "tests/fixtures/menu-groups.ts"

// Groups of items the specs reorder while the menu is open.
function Fixture() {
  const [groups, setGroups] = React.useState(menuGroups)
  React.useEffect(() => onItemsChange(changedMenuGroups, setGroups), [])
  return (
    <div className="fixture">
      <button>Before</button>
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent className="popup">
          {groups.map((group) => (
            <MenuGroup key={group.label}>
              <MenuGroupLabel className="label">{group.label}</MenuGroupLabel>
              {group.items.map((item) => (
                <MenuItem key={item.value} className="item" value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </MenuGroup>
          ))}
        </MenuContent>
      </Menu>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
