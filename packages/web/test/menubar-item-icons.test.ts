// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineMenuElements } from "../src/menu"
import { defineMenubarElements } from "../src/menubar"

const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  Element.prototype.scrollIntoView ??= () => {}
  HTMLElement.prototype.showPopover ??= function () {}
  HTMLElement.prototype.hidePopover ??= function () {}
  defineMenuElements()
  defineMenubarElements()
})

test("item icons in a menubar's menu mark the menu's content, not the bar", async () => {
  document.body.innerHTML = `
    <ui-menubar>
      <ui-menu>
        <ui-menu-trigger><button>File</button></ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-item value="new"><ui-menu-item-icon>+</ui-menu-item-icon>New</ui-menu-item>
          <ui-menu-item value="open">Open</ui-menu-item>
        </ui-menu-content>
      </ui-menu>
    </ui-menubar>`
  await wait()
  const bar = document.querySelector("ui-menubar")!
  expect(bar.hasAttribute("data-has-icons")).toBe(false)
  document.querySelector("button")!.click()
  await wait()
  const content = document.querySelector("ui-menu-content")!
  expect(content.getAttribute("role")).toBe("menu")
  expect(content.hasAttribute("data-has-icons")).toBe(true)
  expect(bar.hasAttribute("data-has-icons")).toBe(false)
})

test("an icon on a menubar's trigger marks the bar", async () => {
  document.body.innerHTML = `
    <ui-menubar>
      <ui-menu>
        <ui-menu-trigger><button><ui-menu-item-icon>*</ui-menu-item-icon>File</button></ui-menu-trigger>
        <ui-menu-content><ui-menu-item value="new">New</ui-menu-item></ui-menu-content>
      </ui-menu>
    </ui-menubar>`
  await wait()
  expect(
    document.querySelector("ui-menubar")!.hasAttribute("data-has-icons")
  ).toBe(true)
})
