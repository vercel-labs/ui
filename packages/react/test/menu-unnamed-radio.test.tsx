// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { Menu, MenuContent, MenuRadioGroup, MenuRadioItem } from "../src/menu"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
Element.prototype.getAnimations ??= () => []

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.innerHTML = ""
})

test("an unnamed radio group keeps its choice after the menu closes", async () => {
  let setOpen: (open: boolean) => void = () => {}
  function Theme() {
    const [open, set] = React.useState(true)
    setOpen = set
    return (
      <Menu open={open} onOpenChange={set}>
        <MenuContent>
          <MenuRadioGroup defaultValue="light">
            <MenuRadioItem value="light">Light</MenuRadioItem>
            <MenuRadioItem value="dark">Dark</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    )
  }
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await React.act(async () => root!.render(<Theme />))
  const dark = () =>
    [...document.querySelectorAll('[role="menuitemradio"]')].find(
      (item) => item.textContent === "Dark"
    )!
  await React.act(async () =>
    dark().dispatchEvent(new MouseEvent("click", { bubbles: true }))
  )
  expect(dark().getAttribute("aria-checked")).toBe("true")
  await React.act(async () => {
    setOpen(false)
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  expect(document.querySelector('[role="menuitemradio"]')).toBeNull()
  await React.act(async () => setOpen(true))
  expect(dark().getAttribute("aria-checked")).toBe("true")
})
