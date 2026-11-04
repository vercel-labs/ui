// @vitest-environment jsdom
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import {
  createTokenInputController,
  fromText,
  type Token,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
} from "../src/token-input"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root | undefined
afterEach(() => {
  act(() => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

const renderToken = (token: Token) => <TokenInputToken>{token.label}</TokenInputToken>

function mount(element: React.ReactNode) {
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  act(() => root!.render(element))
  return (next: React.ReactNode) => act(() => root!.render(next))
}

// What each host shows, and what it reads as: its content, then its kind.
const hosts = () =>
  [...document.querySelectorAll("[data-slot='token-input-host']")].map((host) => host.textContent)

test("tokens a token input starts with show only what renderToken renders", () => {
  const controller = createTokenInputController()
  const defaultValue = fromText("Open [@routes.ts](file:routes.ts) and [@app.ts](file:app.ts)")
  mount(
    <TokenInput defaultValue={defaultValue} controller={controller} renderToken={renderToken}>
      <TokenInputEditor aria-label="Prompt" />
    </TokenInput>,
  )
  expect(hosts()).toEqual(["routes.ts file", "app.ts file"])
  expect(document.querySelectorAll("[data-slot='token-input-token']")).toHaveLength(2)
  expect(controller.getText()).toBe("Open [@routes.ts](file:routes.ts) and [@app.ts](file:app.ts)")
})

test("tokens show their label again when renderToken goes, and its content when it comes back", () => {
  const defaultValue = fromText("[@routes.ts](file:routes.ts)")
  const render = mount(
    <TokenInput defaultValue={defaultValue} renderToken={renderToken}>
      <TokenInputEditor aria-label="Prompt" />
    </TokenInput>,
  )
  render(
    <TokenInput defaultValue={defaultValue}>
      <TokenInputEditor aria-label="Prompt" />
    </TokenInput>,
  )
  expect(hosts()).toEqual(["routes.ts file"])
  expect(document.querySelector("[data-slot='token-input-token']")).toBeNull()
  render(
    <TokenInput defaultValue={defaultValue} renderToken={renderToken}>
      <TokenInputEditor aria-label="Prompt" />
    </TokenInput>,
  )
  expect(hosts()).toEqual(["routes.ts file"])
  expect(document.querySelectorAll("[data-slot='token-input-token']")).toHaveLength(1)
})

test("tokens changed, removed and added after mount show only what renderToken renders", () => {
  const controller = createTokenInputController()
  mount(
    <TokenInput
      defaultValue={fromText("[@routes.ts](file:routes.ts)")}
      controller={controller}
      renderToken={renderToken}
    >
      <TokenInputEditor aria-label="Prompt" />
    </TokenInput>,
  )
  const [token] = controller.getValue().filter((segment) => typeof segment !== "string")
  act(() => controller.updateToken(token.id!, { label: "router.ts" }))
  expect(hosts()).toEqual(["router.ts file"])
  act(() => controller.removeToken(token.id!))
  expect(hosts()).toEqual([])
  act(() => controller.undo())
  expect(hosts()).toEqual(["router.ts file"])
  act(() => controller.insert({ type: "file", value: "app.ts", label: "app.ts" }))
  expect(hosts()).toEqual(["router.ts file", "app.ts file"])
})
