import {
  Menu,
  MenuContent,
  MenuItem,
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
      <Menu onAction={setAction}>
        <MenuTrigger>Edit</MenuTrigger>
        <MenuContent>
          <MenuItem value="undo" shortcut="mod+z">
            Undo
          </MenuItem>
          <MenuItem value="redo" shortcut="mod+shift+z">
            Redo
          </MenuItem>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger>
              Find
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
              <MenuItem value="find" shortcut="mod+f">
                Find…
              </MenuItem>
              <MenuItem value="find-next" shortcut="mod+g">
                Find next
              </MenuItem>
              <MenuItem value="find-previous" shortcut="mod+shift+g">
                Find previous
              </MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSub>
            <MenuSubTrigger>
              Transform
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
              <MenuSub>
                <MenuSubTrigger>
                  Case
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
                  <MenuItem value="uppercase">Uppercase</MenuItem>
                  <MenuItem value="lowercase">Lowercase</MenuItem>
                </MenuSubContent>
              </MenuSub>
              <MenuItem value="trim">Trim whitespace</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
      <output data-slot="output">{action() ? `Ran ${action()}` : "Pick an item"}</output>
    </div>
  )
}

export { Example }
