"use client"

import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  createTriggerMenuController,
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
  const [menu] = React.useState(() => createTriggerMenuController())
  const [result, setResult] = React.useState("")
  return (
    <TriggerMenu controller={menu} triggers={[{ char: "@", items: people }]}>
      <div data-slot="stack">
        <TriggerMenuInput aria-label="Message" />
        <div data-slot="row">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={async () => {
              const closed = await menu.open({ trigger: "@" })
              setResult(`Closed with ${closed.reason}`)
            }}
            data-variant="secondary"
          >
            Mention
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              const match = menu.getMatch()
              setResult(match ? `Query “${menu.getQuery()}” at ${match.start}` : `Open: ${menu.isOpen()}`)
              menu.insert(new Date().toLocaleDateString())
            }}
            data-variant="secondary"
          >
            Insert date
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => (menu.isOpen() ? menu.close() : menu.setOpen(true))}
            data-variant="secondary"
          >
            Toggle
          </button>
        </div>
        <p data-slot="hint">{result}</p>
      </div>
      <TriggerMenuContent>
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
