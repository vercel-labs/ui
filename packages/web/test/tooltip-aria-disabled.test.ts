// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineTooltipElements } from "../src/tooltip"

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  HTMLElement.prototype.showPopover ??= function () {}
  HTMLElement.prototype.hidePopover ??= function () {}
  defineTooltipElements()
})

type Tooltip = HTMLElement & { open: boolean }

test("a press on an aria-disabled trigger keeps a tooltip open, and still toggles a toggleable one", async () => {
  document.body.innerHTML = `
    <ui-tooltip id="plain" default-open>
      <ui-tooltip-trigger><button aria-disabled="true">Delete</button></ui-tooltip-trigger>
      <ui-tooltip-content>Only owners can delete</ui-tooltip-content>
    </ui-tooltip>
    <ui-tooltip id="toggle" toggleable>
      <ui-tooltip-trigger><button aria-disabled="true">Publish</button></ui-tooltip-trigger>
      <ui-tooltip-content>Add a title</ui-tooltip-content>
    </ui-tooltip>`
  await wait()
  const plain = document.getElementById("plain") as Tooltip
  const toggle = document.getElementById("toggle") as Tooltip
  plain.querySelector("button")!.click()
  await wait()
  expect(plain.open).toBe(true)
  toggle.querySelector("button")!.click()
  await wait()
  expect(toggle.open).toBe(true)
})
