import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { createSignal, For } from "solid-js"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

function Example() {
  const [side, setSide] = createSignal<(typeof sides)[number]>("bottom")
  const [align, setAlign] = createSignal<(typeof aligns)[number]>("start")

  return (
    <div data-slot="stack">
      <div data-slot="stack">
        <div data-slot="row" role="group" aria-label="Side">
          <For each={sides}>
            {(value) => (
              <button
                data-size="sm"
                aria-pressed={side() === value ? "true" : "false"}
                onClick={() => setSide(value)}
              >
                {value}
              </button>
            )}
          </For>
        </div>
        <div data-slot="row" role="group" aria-label="Align">
          <For each={aligns}>
            {(value) => (
              <button
                data-size="sm"
                aria-pressed={align() === value ? "true" : "false"}
                onClick={() => setAlign(value)}
              >
                {value}
              </button>
            )}
          </For>
        </div>
      </div>
      <Menu>
        <MenuTrigger>Placement</MenuTrigger>
        <MenuContent side={side()} align={align()}>
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  )
}

export { Example }
