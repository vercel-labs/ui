import { Menu, MenuContent, MenuRadioGroup, MenuRadioItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { createSignal, For } from "solid-js"

const statuses = [
  { value: "online", label: "Online", hint: "Visible to everyone" },
  { value: "away", label: "Away", hint: "Shown as idle" },
  { value: "busy", label: "Do not disturb", hint: "Notifications are muted" },
  { value: "invisible", label: "Invisible", hint: "Appear offline" },
]

function Example() {
  const [status, setStatus] = createSignal("online")
  const current = () => statuses.find((option) => option.value === status())!

  return (
    <div data-slot="stack">
      <Menu loop={false}>
        <MenuTrigger>{current().label}</MenuTrigger>
        <MenuContent>
          <MenuRadioGroup value={status()} onValueChange={setStatus}>
            <For each={statuses}>
              {(option) => (
                <MenuRadioItem value={option.value} label={option.label} closeOnSelect>
                  <span data-slot="stack">
                    {option.label}
                    <span data-slot="hint">{option.hint}</span>
                  </span>
                </MenuRadioItem>
              )}
            </For>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
      <output data-slot="output">Arrow keys stop at the ends. Type a status to jump to it.</output>
    </div>
  )
}

export { Example }
