// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { defineHoverCardElements } from "../src/hover-card"
import { definePopoverElements } from "../src/popover"

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  HTMLElement.prototype.showPopover ??= function () {}
  HTMLElement.prototype.hidePopover ??= function () {}
  definePopoverElements()
  defineHoverCardElements()
})

test("a closed popup that several triggers share is named by its content's aria-label", async () => {
  const agent = createAgent()
  document.body.innerHTML = `
    <ui-popover-trigger for="team"><button>Design</button></ui-popover-trigger>
    <ui-popover-trigger for="team"><button>Sales</button></ui-popover-trigger>
    <ui-popover id="team">
      <ui-popover-content keep-mounted hidden aria-label="Team info">
        <ui-popover-title></ui-popover-title>
      </ui-popover-content>
    </ui-popover>
    <ui-hover-card-trigger for="site"><a href="#docs">Docs</a></ui-hover-card-trigger>
    <ui-hover-card-trigger for="site"><a href="#blog">Blog</a></ui-hover-card-trigger>
    <ui-hover-card id="site">
      <ui-hover-card-content keep-mounted hidden aria-label="Link preview"><p>Preview</p></ui-hover-card-content>
    </ui-hover-card>`
  await wait()
  const popups = agent
    .snapshot()
    .filter(
      ({ component }) => component === "popover" || component === "hover-card"
    )
    .map(({ component, label }) => [component, label])
  expect(popups).toEqual([
    ["popover", "Team info"],
    ["hover-card", "Link preview"],
  ])
})
