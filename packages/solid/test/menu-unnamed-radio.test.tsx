import { render } from "@solidjs/web"
import { createSignal, flush } from "solid-js"
import { afterEach, expect, test } from "vitest"
import { Menu, MenuContent, MenuRadioGroup, MenuRadioItem } from "../src/menu"

let dispose = () => {}
afterEach(() => {
  dispose()
  document.body.replaceChildren()
})

test("an unnamed radio group keeps its choice after the menu closes", async () => {
  const [open, setOpen] = createSignal(true)
  const root = document.body.appendChild(document.createElement("div"))
  dispose = render(
    () => (
      <Menu open={open()} onOpenChange={setOpen}>
        <MenuContent>
          <MenuRadioGroup defaultValue="light">
            <MenuRadioItem value="light">Light</MenuRadioItem>
            <MenuRadioItem value="dark">Dark</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    ),
    root
  )
  flush()
  const dark = () =>
    [...document.querySelectorAll('[role="menuitemradio"]')].find(
      (item) => item.textContent === "Dark"
    )!
  dark().dispatchEvent(new MouseEvent("click", { bubbles: true }))
  flush()
  expect(dark().getAttribute("aria-checked")).toBe("true")
  setOpen(false)
  flush()
  await new Promise((resolve) => setTimeout(resolve, 20))
  flush()
  expect(document.querySelector('[role="menuitemradio"]')).toBeNull()
  setOpen(true)
  flush()
  expect(dark().getAttribute("aria-checked")).toBe("true")
})
