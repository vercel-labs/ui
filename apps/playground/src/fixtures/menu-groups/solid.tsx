import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { render } from "@solidjs/web"
import { createEffect, createSignal, For } from "solid-js"
import { onItemsChange } from "tests/fixtures/items.ts"
import { changedMenuGroups, menuGroups } from "tests/fixtures/menu-groups.ts"

// Groups of items the specs reorder while the menu is open.
function Fixture() {
  const [groups, setGroups] = createSignal(menuGroups)
  createEffect(
    () => 0,
    () => onItemsChange(changedMenuGroups, setGroups)
  )
  return (
    <div class="fixture">
      <button>Before</button>
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent class="popup">
          <For each={groups()} keyed={(group) => group.label}>
            {(group) => (
              <MenuGroup>
                <MenuGroupLabel class="label">{group().label}</MenuGroupLabel>
                <For each={group().items} keyed={(item) => item.value}>
                  {(item) => (
                    <MenuItem class="item" value={item().value}>
                      {item().label}
                    </MenuItem>
                  )}
                </For>
              </MenuGroup>
            )}
          </For>
        </MenuContent>
      </Menu>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
