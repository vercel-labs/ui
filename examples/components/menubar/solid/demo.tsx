import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { Menubar } from "@ui-sdk/solid/menubar"
import { For } from "solid-js"

const profiles = [
  { value: "hollis", label: "Hollis" },
  { value: "ines", label: "Inès" },
  { value: "kofi", label: "Kofi" },
]

function Example() {
  return (
    <Menubar>
      <Menu>
        <MenuTrigger>File</MenuTrigger>
        <MenuContent>
          <MenuItem shortcut="mod+t">New Tab</MenuItem>
          <MenuItem shortcut="mod+n">New Window</MenuItem>
          <MenuItem disabled>New Incognito Window</MenuItem>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger>
              Share
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>Email link</MenuItem>
              <MenuItem>Messages</MenuItem>
              <MenuItem>Notes</MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSeparator />
          <MenuItem shortcut="mod+p">Print…</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger>Edit</MenuTrigger>
        <MenuContent>
          <MenuItem shortcut="mod+z">Undo</MenuItem>
          <MenuItem shortcut="mod+shift+z">Redo</MenuItem>
          <MenuSeparator />
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger>View</MenuTrigger>
        <MenuContent>
          <MenuCheckboxItem value="bookmarks">
            <MenuItemIndicator>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </MenuItemIndicator>
            Always Show Bookmarks Bar
          </MenuCheckboxItem>
          <MenuCheckboxItem value="urls" defaultChecked>
            <MenuItemIndicator>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </MenuItemIndicator>
            Always Show Full URLs
          </MenuCheckboxItem>
          <MenuSeparator />
          <MenuItem shortcut="mod+r">Reload</MenuItem>
          <MenuItem>Toggle Fullscreen</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger>Profiles</MenuTrigger>
        <MenuContent>
          <MenuRadioGroup defaultValue="ines">
            <For each={profiles}>
              {(profile) => (
                <MenuRadioItem value={profile.value}>
                  <MenuItemIndicator />
                  {profile.label}
                </MenuRadioItem>
              )}
            </For>
          </MenuRadioGroup>
          <MenuSeparator />
          <MenuItem>Edit…</MenuItem>
          <MenuItem>Add Profile…</MenuItem>
        </MenuContent>
      </Menu>
    </Menubar>
  )
}

export { Example }
