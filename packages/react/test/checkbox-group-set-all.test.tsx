// @vitest-environment jsdom
import { act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { Checkbox, CheckboxGroup } from "../src/checkbox"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

afterEach(() => document.body.replaceChildren())

test("an agent checks and unchecks every checkbox in a group with setAll", async () => {
  const root = document.body.appendChild(document.createElement("div"))
  const app = createRoot(root)
  const values: string[][] = []
  await act(async () =>
    app.render(
      <CheckboxGroup
        aria-label="Toppings"
        defaultValue={["a"]}
        onValueChange={(value, details) => {
          values.push(value)
          expect(details.reason).toBe("imperative")
        }}
      >
        <Checkbox value="a" aria-label="A" />
        <Checkbox value="b" aria-label="B" />
      </CheckboxGroup>
    )
  )
  const agent = createAgent()
  const run = (checked: boolean) =>
    act(() =>
      agent.act({
        steps: [{ ref: "Toppings", action: "setAll", args: [checked] }],
      })
    )
  expect(await run(true)).toMatchObject({ ok: true })
  expect(await run(false)).toMatchObject({ ok: true })
  expect(values).toEqual([["a", "b"], []])
  await act(async () => app.unmount())
})
