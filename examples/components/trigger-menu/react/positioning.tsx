"use client"

import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/react/trigger-menu"
import * as React from "react"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

function Example() {
  const [field, setField] = React.useState<HTMLTextAreaElement | null>(null)
  const [box, setBox] = React.useState<HTMLDivElement | null>(null)
  return (
    <TriggerMenu triggers={[{ char: "@", items: people }]}>
      <div data-slot="stack">
        <TriggerMenuInput
          ref={setField}
          aria-label="Comment"
          placeholder="The list opens above, at the field's start"
        />
        <div ref={setBox} />
      </div>
      <TriggerMenuContent
        side="top"
        align="start"
        sideOffset={8}
        alignOffset={-4}
        collisionPadding={16}
        anchor={field}
        keepMounted
        container={box}
      >
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
