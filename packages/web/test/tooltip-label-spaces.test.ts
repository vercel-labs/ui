// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineTooltipElements } from "../src/tooltip"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  defineTooltipElements()
})

test("a tooltip with a hidden part keeps a space between its blocks in its label", async () => {
  document.body.innerHTML = `
    <ui-tooltip>
      <ui-tooltip-trigger><button>Olivia</button></ui-tooltip-trigger>
      <ui-tooltip-content><div>Olivia Martin</div><div>Admin</div><div id="status">Online</div></ui-tooltip-content>
    </ui-tooltip>`
  await wait()
  const content = document.querySelector("ui-tooltip-content")!
  expect(content.getAttribute("aria-label")).toBeNull()
  document.getElementById("status")!.hidden = true
  await wait()
  expect(content.getAttribute("aria-label")).toBe("Olivia Martin Admin")
})
