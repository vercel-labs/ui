// @vitest-environment jsdom
import { act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { Checkbox, CheckboxGroup } from "../src/checkbox"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

afterEach(() => document.body.replaceChildren())

test("a group given its value out of order reads it in the checkboxes' order", async () => {
  const root = document.body.appendChild(document.createElement("div"))
  const app = createRoot(root)
  await act(async () =>
    app.render(
      <CheckboxGroup
        aria-label="Letters"
        value={["b", "a"]}
        onValueChange={() => {}}
      >
        <Checkbox value="a" aria-label="A" />
        <Checkbox value="b" aria-label="B" />
      </CheckboxGroup>
    )
  )
  const group = createAgent()
    .snapshot()
    .find((entry) => entry.label === "Letters")
  expect(group?.value).toEqual(["a", "b"])
  await act(async () => app.unmount())
})
