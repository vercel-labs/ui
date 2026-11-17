// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test, vi } from "vitest"
import { createAgent } from "../src/agent"
import { Command, CommandInput, CommandItem, CommandList } from "../src/command"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root | undefined
afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

const items = [
  { value: "calendar", label: "Calendar" },
  { value: "delete", label: "Delete account" },
]

test("an agent can't run a marked command the query hides, so its mark is read", async () => {
  const onAction = vi.fn()
  root = createRoot(document.body.appendChild(document.createElement("div")))
  await React.act(async () =>
    root!.render(
      <Command items={items} defaultQuery="cal" onAction={onAction}>
        <CommandInput aria-label="Search commands" />
        <CommandList>
          {(state) =>
            state.items.map((item) =>
              "value" in item ? (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  data-agent-confirm={
                    item.value === "delete" ? "Deletes your account" : undefined
                  }
                >
                  {item.label}
                </CommandItem>
              ) : null
            )
          }
        </CommandList>
      </Command>
    )
  )
  const agent = createAgent()
  const run = () =>
    agent.act({
      steps: [
        { ref: "Search commands", action: "run", args: ["Delete account"] },
      ],
    })
  expect((await run()).error?.message).toBe(
    `"Delete account" isn't shown in Search commands (${agent.snapshot()[0].ref}) now. Set the query or page that shows it, then run it.`
  )
  await agent.act({
    steps: [{ ref: "Search commands", action: "setQuery", args: [""] }],
  })
  expect((await run()).error?.message).toBe(
    'Needs a person: "Deletes your account". Ask them to make this change themselves.'
  )
  expect(onAction).not.toHaveBeenCalled()
})
