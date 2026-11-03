import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { createSignal, For } from "solid-js"

function Example() {
  const [position, setPosition] = createSignal("bottom")

  return (
    <div data-slot="stack">
      <Menu>
        <MenuTrigger>Panel</MenuTrigger>
        <MenuContent>
          <MenuRadioGroup name="position" value={position()} onValueChange={setPosition}>
            <MenuGroupLabel>Position</MenuGroupLabel>
            <For each={["Top", "Bottom", "Right"]}>
              {(option) => (
                <MenuRadioItem value={option.toLowerCase()}>
                  <MenuItemIndicator />
                  {option}
                </MenuRadioItem>
              )}
            </For>
          </MenuRadioGroup>
          <MenuSeparator />
          <MenuRadioGroup defaultValue="comfortable">
            <MenuGroupLabel>Density</MenuGroupLabel>
            <For each={["Compact", "Comfortable"]}>
              {(option) => (
                <MenuRadioItem value={option.toLowerCase()}>
                  <MenuItemIndicator />
                  {option}
                </MenuRadioItem>
              )}
            </For>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
      <output data-slot="output">Panel at the {position()}</output>
    </div>
  )
}

export { Example }
