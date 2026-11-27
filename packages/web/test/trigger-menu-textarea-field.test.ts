// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineInputElements } from "../src/input"
import { defineTriggerMenuElements } from "../src/trigger-menu"

const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

beforeAll(() => {
  Element.prototype.getAnimations ??= () => []
  defineInputElements()
  defineTriggerMenuElements()
})

test("the trigger menu's input takes the textarea inside a ui-textarea", async () => {
  document.body.innerHTML = `
    <ui-trigger-menu>
      <ui-trigger-menu-input>
        <ui-textarea auto-resize><textarea aria-label="Message"></textarea></ui-textarea>
      </ui-trigger-menu-input>
      <ui-trigger-menu-content hidden><ui-trigger-menu-list></ui-trigger-menu-list></ui-trigger-menu-content>
    </ui-trigger-menu>`
  const menu = document.querySelector("ui-trigger-menu")!
  await wait()
  menu.triggers = [{ char: "@", items: ["Ada", "Kai"] }]
  await wait()
  const field = document.querySelector("textarea")!
  const wrapper = document.querySelector("ui-textarea")!
  expect(field.getAttribute("aria-haspopup")).toBe("listbox")
  expect(wrapper.hasAttribute("aria-haspopup")).toBe(false)
  expect(field.style.getPropertyValue("field-sizing")).toBe("content")
})
