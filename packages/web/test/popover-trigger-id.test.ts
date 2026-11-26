// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { definePopoverElements } from "../src/popover"

Element.prototype.getAnimations ??= () => []
HTMLElement.prototype.showPopover ??= function () {}
HTMLElement.prototype.hidePopover ??= function () {}

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

afterEach(() => document.body.replaceChildren())

test("removing the triggers before it gives the trigger id to the one left", async () => {
  definePopoverElements()
  document.body.innerHTML = `<ui-popover id="p">
    ${["a", "b", "c"].map((name) => `<ui-popover-trigger id="${name}"><button>${name}</button></ui-popover-trigger>`).join("")}
    <ui-popover-content></ui-popover-content>
  </ui-popover>`
  await wait()
  const named = () =>
    [...document.querySelectorAll("button[id]")].map((el) => el.textContent)
  expect(named()).toEqual(["a"])
  document.getElementById("a")!.remove()
  await wait()
  expect(named()).toEqual(["b"])
  document.getElementById("b")!.remove()
  await wait()
  expect(named()).toEqual(["c"])
})
