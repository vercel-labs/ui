import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  TriggerMenuStatus,
} from "@ui-sdk/solid/trigger-menu"
import { createUniqueId, For } from "solid-js"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

function Example() {
  const id = createUniqueId()
  return (
    <TriggerMenu triggers={[{ char: "@", items: people }]}>
      <div data-slot="stack">
        <label for={id} data-slot="label">
          Message
        </label>
        <TriggerMenuInput id={id} placeholder="Type @ to mention someone" />
        <div data-slot="visually-hidden">
          <TriggerMenuStatus />
        </div>
      </div>
      <TriggerMenuContent>
        <TriggerMenuEmpty>No one found.</TriggerMenuEmpty>
        <TriggerMenuList>
          {(state) => (
            <For each={state.items as TriggerMenuDataItem[]}>
              {(item) => (
                <TriggerMenuItem value={item.value} label={item.label} disabled={item.disabled}>
                  {item.label}
                </TriggerMenuItem>
              )}
            </For>
          )}
        </TriggerMenuList>
      </TriggerMenuContent>
    </TriggerMenu>
  )
}

export { Example }
