"use client"

import { useId } from "react"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  TriggerMenuStatus,
} from "@ui-sdk/react/trigger-menu"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

function Example() {
  const id = useId()
  return (
    <TriggerMenu triggers={[{ char: "@", items: people }]}>
      <div data-slot="stack">
        <label htmlFor={id} data-slot="label">
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
          {(state) =>
            (state.items as TriggerMenuDataItem[]).map((item) => (
              <TriggerMenuItem
                key={item.value}
                value={item.value}
                label={item.label}
                disabled={item.disabled}
              >
                {item.label}
              </TriggerMenuItem>
            ))
          }
        </TriggerMenuList>
      </TriggerMenuContent>
    </TriggerMenu>
  )
}

export { Example }
