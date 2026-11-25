// @vitest-environment jsdom
// A trigger's `payload` attribute carries a string from markup, and the property wins over it.
import { afterEach, expect, test } from "vitest"
import { definePopoverElements } from "../src/popover"

Element.prototype.getAnimations ??= () => []
HTMLElement.prototype.showPopover ??= function () {}
HTMLElement.prototype.hidePopover ??= function () {}

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

afterEach(() => document.body.replaceChildren())

type Popover = HTMLElement & {
  open: boolean
  api: { getPayload: () => unknown }
}
type Trigger = HTMLElement & { payload: unknown }

function render() {
  definePopoverElements()
  document.body.innerHTML = `
    <ui-popover id="swatches"><ui-popover-content></ui-popover-content></ui-popover>
    <ui-popover-trigger id="walnut" for="swatches" payload="Walnut"><button>Walnut</button></ui-popover-trigger>
    <ui-popover-trigger id="ebony" for="swatches" payload="Ebony"><button>Ebony</button></ui-popover-trigger>`
  return {
    popover: document.getElementById("swatches") as Popover,
    trigger: (id: string) => document.getElementById(id) as Trigger,
  }
}

test("a trigger opens with the string its `payload` attribute says", async () => {
  const { popover, trigger } = render()
  await wait()
  trigger("ebony").querySelector("button")!.click()
  await wait()
  expect(popover.open).toBe(true)
  expect(popover.api.getPayload()).toBe("Ebony")
  expect(trigger("walnut").payload).toBe("Walnut")
})

test("a `payload` property wins over the attribute", async () => {
  const { popover, trigger } = render()
  const walnut = { name: "Walnut", hex: "#5d4037" }
  trigger("walnut").payload = walnut
  await wait()
  trigger("walnut").querySelector("button")!.click()
  await wait()
  expect(popover.api.getPayload()).toBe(walnut)
})

test("a `payload` property set to null wins over the attribute too", async () => {
  const { popover, trigger } = render()
  trigger("walnut").payload = null
  await wait()
  expect(trigger("walnut").payload).toBe(null)
  trigger("walnut").querySelector("button")!.click()
  await wait()
  expect(popover.api.getPayload()).toBe(null)
})

test("a changed `payload` attribute is the next open's payload", async () => {
  const { popover, trigger } = render()
  await wait()
  trigger("walnut").setAttribute("payload", "Oak")
  trigger("walnut").querySelector("button")!.click()
  await wait()
  expect(popover.api.getPayload()).toBe("Oak")
})
