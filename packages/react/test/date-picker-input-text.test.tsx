// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { DatePicker, DatePickerInput } from "../src/date-picker"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
Element.prototype.getAnimations ??= () => []

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.innerHTML = ""
})

const type = (input: HTMLInputElement, text: string) =>
  React.act(async () => {
    // The native setter, so React sees the edit as a person's.
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )!.set!.call(input, text)
    input.dispatchEvent(new Event("input", { bubbles: true }))
  })

test("clearing a date the app set reports null", async () => {
  const changes: unknown[] = []
  let pick: (date: string) => void = () => {}
  function Field() {
    const [value, setValue] = React.useState<string | null>(null)
    pick = setValue
    return (
      <DatePicker
        value={value}
        onValueChange={(next) => {
          changes.push(next)
          setValue(next as string | null)
        }}
      >
        <DatePickerInput aria-label="Due" />
      </DatePicker>
    )
  }
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await React.act(async () => root!.render(<Field />))
  const input = container.querySelector<HTMLInputElement>("input[type=text]")!
  await React.act(async () => pick("2026-03-14"))
  expect(input.value).not.toBe("")
  await React.act(async () => input.focus())
  await type(input, "")
  await React.act(async () => input.blur())
  expect(changes).toEqual([null])
})

test("a form reset keeps a controlled field's text with its value", async () => {
  let pick: (date: string) => void = () => {}
  function Field() {
    const [value, setValue] = React.useState<string | null>("2026-03-14")
    pick = setValue
    return (
      <form>
        <DatePicker
          value={value}
          onValueChange={(next) => setValue(next as string | null)}
        >
          <DatePickerInput aria-label="Due" />
        </DatePicker>
      </form>
    )
  }
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await React.act(async () => root!.render(<Field />))
  const input = container.querySelector<HTMLInputElement>("input[type=text]")!
  const march = input.value
  await React.act(async () => pick("2026-04-01"))
  const april = input.value
  expect(april).not.toBe(march)
  await React.act(async () => {
    container.querySelector("form")!.reset()
    await new Promise((resolve) => setTimeout(resolve, 10))
  })
  expect(input.value).toBe(april)
})

test("typing the text a form reset replaced reports it again", async () => {
  const changes: unknown[] = []
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await React.act(async () =>
    root!.render(
      <form>
        <DatePicker
          name="due"
          defaultValue="2026-03-14"
          onValueChange={(next) => changes.push(next)}
        >
          <DatePickerInput aria-label="Due" />
        </DatePicker>
      </form>
    )
  )
  const input = container.querySelector<HTMLInputElement>("input[type=text]")!
  const enter = async (text: string) => {
    await React.act(async () => input.focus())
    await type(input, text)
    await React.act(async () => input.blur())
  }
  await enter("04/01/2026")
  await React.act(async () => {
    container.querySelector("form")!.reset()
    await new Promise((resolve) => setTimeout(resolve, 10))
  })
  expect(input.value).toBe("03/14/2026")
  await enter("04/01/2026")
  expect(changes).toEqual(["2026-04-01", "2026-03-14", "2026-04-01"])
})
