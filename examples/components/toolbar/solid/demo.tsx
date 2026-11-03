import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { Toggle, ToggleGroup } from "@ui-sdk/solid/toggle"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/solid/toolbar"
import { For } from "solid-js"

function Example() {
  return (
    <Toolbar aria-label="Formatting">
      <ToggleGroup multiple aria-label="Text style">
        <Toggle data-variant="ghost" value="bold" aria-label="Bold">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
          </svg>
        </Toggle>
        <Toggle data-variant="ghost" value="italic" aria-label="Italic">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="19" x2="10" y1="4" y2="4" />
            <line x1="14" x2="5" y1="20" y2="20" />
            <line x1="15" x2="9" y1="4" y2="20" />
          </svg>
        </Toggle>
        <Toggle data-variant="ghost" value="underline" aria-label="Underline">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 4v6a6 6 0 0 0 12 0V4" />
            <line x1="4" x2="20" y1="20" y2="20" />
          </svg>
        </Toggle>
      </ToggleGroup>
      <ToolbarSeparator />
      <Menu>
        <ToolbarButton data-variant="secondary" render={(props) => <MenuTrigger {...props} />}>
          Sans
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </ToolbarButton>
        <MenuContent>
          <For each={["Sans", "Serif", "Mono"]}>{(font) => <MenuItem>{font}</MenuItem>}</For>
        </MenuContent>
      </Menu>
    </Toolbar>
  )
}

export { Example }
