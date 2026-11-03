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
  const [open, setOpen] = React.useState(false)
  const [log, setLog] = React.useState<string[]>([])
  const note = (line: string) => setLog((lines) => [line, ...lines].slice(0, 4))
  return (
    <TriggerMenu
      triggers={[
        { char: "@", items: people },
        { char: "/", boundary: "start", items: commands },
      ]}
      open={open}
      onOpenChange={(next, details) => {
        setOpen(next)
        note(`${next ? "opened" : "closed"} ${details.trigger ?? ""} (${details.reason})`)
      }}
      onOpenChangeComplete={(next) => note(next ? "finished opening" : "finished closing")}
      onQueryChange={(query, details) =>
        note(`query “${query}”${details.argument ? ` for ${details.argument}` : ""}`)
      }
      autoHighlight={false}
      loop={false}
      shortcut="ctrl+j"
      status="idle"
    >
      <div data-slot="stack">
        <TriggerMenuInput aria-label="Message" placeholder="Type @ or /" />
        <ul data-slot="output">
          {log.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
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
