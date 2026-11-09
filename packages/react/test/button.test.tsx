// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { Button } from "../src/button"
import { withSource } from "../src/observe"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

test("a press hands the handler its event and how the button was pressed", async () => {
  const calls: [string, string][] = []
  const host = document.createElement("div")
  document.body.append(host)
  root = createRoot(host)
  await React.act(async () =>
    root!.render(
      <Button onClick={(event, { source }) => calls.push([event.type, source])}>
        Save
      </Button>
    )
  )
  const button = host.querySelector("button")!
  await React.act(async () => withSource("agent", () => button.click()))
  expect(calls).toEqual([["click", "agent"]])
})
