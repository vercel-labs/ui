import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroupLabel,
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
import { createSignal } from "solid-js"

function Example() {
  const [action, setAction] = createSignal("")

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <Menu onAction={setAction}>
          <MenuTrigger>Document</MenuTrigger>
          <MenuContent>
            <MenuItem value="undo" shortcut="mod+z" disabled>
              Undo
            </MenuItem>
            <MenuItem value="redo" shortcut="mod+shift+z">
              Redo
            </MenuItem>
            <MenuSeparator />
            <MenuCheckboxItem value="autosave" defaultChecked disabled>
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
              Autosave
            </MenuCheckboxItem>
            <MenuSeparator />
            <MenuRadioGroup defaultValue="pdf">
              <MenuGroupLabel>Export as</MenuGroupLabel>
              <MenuRadioItem value="pdf">
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
                PDF
              </MenuRadioItem>
              <MenuRadioItem value="docx" disabled>
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
                Word
              </MenuRadioItem>
              <MenuRadioItem value="markdown">
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
                Markdown
              </MenuRadioItem>
            </MenuRadioGroup>
            <MenuSeparator />
            <MenuSub>
              <MenuSubTrigger disabled>
                Move to
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
                <MenuItem>Archive</MenuItem>
              </MenuSubContent>
            </MenuSub>
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger disabled>Locked</MenuTrigger>
          <MenuContent>
            <MenuItem>Unlock</MenuItem>
          </MenuContent>
        </Menu>
      </div>
      <output data-slot="output">
        {action() ? `Ran ${action()}` : "Disabled items can be focused but not chosen"}
      </output>
    </div>
  )
}

export { Example }
