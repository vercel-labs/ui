import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { createSignal, For } from "solid-js"

const fonts = [
  "Inter",
  "Geist",
  "IBM Plex Sans",
  "Source Sans",
  "Work Sans",
  "Manrope",
  "DM Sans",
  "Figtree",
  "Outfit",
  "Lexend",
  "Nunito",
  "Rubik",
  "Karla",
  "Barlow",
  "Mulish",
  "Urbanist",
  "Sora",
  "Onest",
]

function Example() {
  const [font, setFont] = createSignal("Inter")

  return (
    <Menu>
      <MenuTrigger>
        {font()}
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
      </MenuTrigger>
      <MenuContent sideOffset={8} alignOffset={-4} collisionPadding={24}>
        <MenuRadioGroup value={font()} onValueChange={setFont}>
          <MenuGroupLabel>Font</MenuGroupLabel>
          <For each={fonts}>
            {(name) => (
              <MenuRadioItem value={name} closeOnSelect>
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
                {name}
              </MenuRadioItem>
            )}
          </For>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  )
}

export { Example }
