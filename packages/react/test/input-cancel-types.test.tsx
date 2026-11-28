// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { Input } from "../src/input"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

test.each([
  ["time", "09:00", "09:30"],
  ["number", "4", "45"],
  ["email", "a@b.co", "a@b.cox"],
])(
  "a canceled change on a %s input puts the value back without throwing",
  async (type, before, after) => {
    const container = document.body.appendChild(document.createElement("div"))
    root = createRoot(container)
    await React.act(async () =>
      root!.render(
        <Input
          type={type}
          aria-label="Field"
          defaultValue={before}
          onValueChange={(_value, details) => details.cancel()}
        />
      )
    )
    const input = container.querySelector("input")!
    const errors: unknown[] = []
    const report = (event: ErrorEvent) => errors.push(event.error)
    window.addEventListener("error", report)
    await React.act(async () => {
      // The prototype's setter, as typing changes the value.
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )!.set!.call(input, after)
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })
    window.removeEventListener("error", report)
    expect(errors).toEqual([])
    expect(input.value).toBe(before)
  }
)
