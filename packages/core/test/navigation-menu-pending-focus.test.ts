// @vitest-environment jsdom
// An arrow key's open moves focus in once the item is open, like after a
// controlled `value` arrives, and only while focus is still on its trigger.
import { afterEach, expect, test, vi } from "vitest"
import { createFocus } from "../src/components/navigation-menu/navigation-menu-focus"

afterEach(() => {
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

function setup() {
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockReturnValue([
    {},
  ] as unknown as DOMRectList)
  Element.prototype.checkVisibility ??= () => true
  document.body.innerHTML = `
    <ul data-slot="navigation-menu-list"><li><button id="trigger">Learn</button></li></ul>
    <div data-slot="navigation-menu-content"><a href="#docs">Docs</a></div>
    <button id="outside">Outside</button>`
  const list = document.querySelector("ul")!
  const trigger = document.querySelector<HTMLElement>("#trigger")!
  const content = document.querySelector<HTMLElement>(
    '[data-slot="navigation-menu-content"]'
  )!
  let value: string | null = null
  const focus = createFocus({
    orientation: () => "horizontal",
    value: () => value,
    list: () => list,
    triggers: () => [{ el: trigger, key: "learn" }],
    links: () => [],
    trigger: () => trigger,
    content: () => content,
    panel: () => content,
    open: () => {},
    close: () => {},
  })
  list.addEventListener("keydown", (event) => focus.listKeydown(event, list))
  trigger.focus()
  trigger.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true,
    })
  )
  return {
    open: async () => {
      value = "learn"
      focus.valueChanged()
      await Promise.resolve()
    },
  }
}

test("focus moves into the panel once the item it opened is open", async () => {
  const { open } = setup()
  await open()
  expect(document.activeElement?.textContent).toBe("Docs")
})

test("focus stays put when the item opens after focus left its trigger", async () => {
  const { open } = setup()
  document.querySelector<HTMLElement>("#outside")!.focus()
  await open()
  expect(document.activeElement?.id).toBe("outside")
})
