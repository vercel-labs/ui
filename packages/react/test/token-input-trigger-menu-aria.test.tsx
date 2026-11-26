// @vitest-environment jsdom
// A trigger menu in a token input marks the editor as offering suggestions
// from mount, written before or after the editor.
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { TokenInput, TokenInputEditor } from "../src/token-input"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuList,
} from "../src/trigger-menu"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
Element.prototype.getAnimations ??= () => []

let root: Root | undefined
afterEach(() => {
  act(() => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

const menu = (
  <TriggerMenu
    key="menu"
    triggers={[{ char: "@", type: "mention", items: ["Ada"] }]}
  >
    <TriggerMenuContent>
      <TriggerMenuList />
    </TriggerMenuContent>
  </TriggerMenu>
)
const editor = <TokenInputEditor key="editor" aria-label="Message" />

test.each([
  ["after", [editor, menu]],
  ["before", [menu, editor]],
])("a trigger menu %s the editor marks it from mount", async (_, children) => {
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await act(async () => root!.render(<TokenInput>{children}</TokenInput>))
  const field = document.querySelector('[data-slot="token-input-editor"]')!
  expect(field.getAttribute("aria-autocomplete")).toBe("list")
  expect(field.getAttribute("aria-haspopup")).toBe("listbox")
})
