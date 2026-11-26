// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineMenuElements } from "../src/menu"

const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  Element.prototype.scrollIntoView ??= () => {}
  HTMLElement.prototype.showPopover ??= function () {}
  HTMLElement.prototype.hidePopover ??= function () {}
  defineMenuElements()
})

test("a menu whose only icon is on a submenu trigger has data-has-icons once opened", async () => {
  document.body.innerHTML = `
    <ui-menu>
      <ui-menu-trigger><button>File</button></ui-menu-trigger>
      <ui-menu-content>
        <ui-menu-sub>
          <ui-menu-sub-trigger><ui-menu-item-icon>→</ui-menu-item-icon>Move to</ui-menu-sub-trigger>
          <ui-menu-sub-content><ui-menu-item>Projects</ui-menu-item></ui-menu-sub-content>
        </ui-menu-sub>
        <ui-menu-item>Rename</ui-menu-item>
      </ui-menu-content>
    </ui-menu>`
  await wait()
  document.querySelector("button")!.click()
  await wait()
  const content = document.querySelector("ui-menu-content")!
  expect(content.getAttribute("role")).toBe("menu")
  expect(content.hasAttribute("data-has-icons")).toBe(true)
})
