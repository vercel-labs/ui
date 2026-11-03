"use client"

import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuHint,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/react/trigger-menu"
import * as React from "react"

const commands = [
  {
    value: "model",
    label: "model",
    arguments: [
      { name: "model", hint: "<model>", required: true, items: ["opus", "sonnet", "haiku"] },
      { name: "effort", hint: "[effort]", items: ["low", "medium", "high"], allowCustomValue: false },
    ],
  },
  { value: "search", label: "search", arguments: [{ name: "query", hint: "<query>", required: true }] },
  { value: "clear", label: "clear" },
  { value: "send", label: "send", after: "submit" as const },
]

function Example() {
  const [last, setLast] = React.useState("")
  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setLast(`Sent: ${new FormData(event.currentTarget).get("prompt")}`)
      }}
    >
      <TriggerMenu
        triggers={[{ char: "/", boundary: "start", type: "command", items: commands }]}
        onSelect={(value, details) => setLast(`/${value} ${JSON.stringify(details.arguments)}`)}
      >
        <TriggerMenuInput name="prompt" aria-label="Prompt" placeholder="Try /model or /search" />
        <TriggerMenuHint />
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
      <p data-slot="hint">{last || "/send submits the form."}</p>
    </form>
  )
}

export { Example }
