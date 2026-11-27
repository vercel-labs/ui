// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import {
  NumberInput,
  NumberInputControl,
  NumberInputGroup,
} from "../src/number-input"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  document.body.innerHTML = ""
})

test("clearing a field stepped from empty reports null", async () => {
  const changes: (number | null)[] = []
  function Field() {
    const [value, setValue] = React.useState<number | null>(null)
    return (
      <NumberInput
        value={value}
        onValueChange={(next) => {
          changes.push(next)
          setValue(next)
        }}
      >
        <NumberInputGroup>
          <NumberInputControl aria-label="Amount" />
        </NumberInputGroup>
      </NumberInput>
    )
  }
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await React.act(async () => root!.render(<Field />))
  const input = container.querySelector<HTMLInputElement>("input[type=text]")!
  await React.act(async () => input.focus())
  await React.act(async () => {
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
    )
    input.dispatchEvent(
      new KeyboardEvent("keyup", { key: "ArrowUp", bubbles: true })
    )
  })
  expect(input.value).toBe("1")
  // The native setter, so React sees the edit as a person's.
  await React.act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )!.set!.call(input, "")
    input.dispatchEvent(new Event("input", { bubbles: true }))
  })
  await React.act(async () => input.blur())
  expect(changes).toEqual([1, null])
})

test("a form reset keeps a controlled field's text with its value", async () => {
  function Field() {
    const [value, setValue] = React.useState<number | null>(5)
    return (
      <form>
        <NumberInput value={value} onValueChange={setValue}>
          <NumberInputGroup>
            <NumberInputControl aria-label="Amount" />
          </NumberInputGroup>
        </NumberInput>
      </form>
    )
  }
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await React.act(async () => root!.render(<Field />))
  const input = container.querySelector<HTMLInputElement>("input[type=text]")!
  await React.act(async () => input.focus())
  await React.act(async () => {
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
    )
    input.dispatchEvent(
      new KeyboardEvent("keyup", { key: "ArrowUp", bubbles: true })
    )
  })
  expect(input.value).toBe("6")
  await React.act(async () => {
    container.querySelector("form")!.reset()
    await new Promise((resolve) => setTimeout(resolve))
  })
  expect(input.value).toBe("6")
})

test("typing the text a form reset replaced reports it again", async () => {
  const changes: (number | null)[] = []
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await React.act(async () =>
    root!.render(
      <form>
        <NumberInput
          defaultValue={5}
          onValueChange={(next) => changes.push(next)}
        >
          <NumberInputGroup>
            <NumberInputControl aria-label="Amount" />
          </NumberInputGroup>
        </NumberInput>
      </form>
    )
  )
  const input = container.querySelector<HTMLInputElement>("input[type=text]")!
  const type = async (text: string) => {
    await React.act(async () => input.focus())
    await React.act(async () => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )!.set!.call(input, text)
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })
    await React.act(async () => input.blur())
  }
  await type("7")
  await React.act(async () => {
    container.querySelector("form")!.reset()
    await new Promise((resolve) => setTimeout(resolve))
  })
  expect(input.value).toBe("5")
  await type("7")
  expect(changes).toEqual([7, 5, 7])
})
