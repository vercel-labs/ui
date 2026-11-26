// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { definePrimitive } from "@ui-sdk/core"
import { defineButtonElements } from "../src/button"
import { defineCollapsibleElements } from "../src/collapsible"
import { createParts, wrappedButton } from "../src/index"
import { definePopoverElements } from "../src/popover"

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

const badgeButton = definePrimitive({
  name: "badge-button",
  state: () => ({}),
  api: () => ({}),
  slots: (slot) => ({ root: slot({}) }),
})

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  HTMLElement.prototype.showPopover ??= function () {}
  HTMLElement.prototype.hidePopover ??= function () {}
  document.body.innerHTML = `<div id="parsed"><x-badge-button><ui-button><button>Parsed</button></ui-button></x-badge-button></div>`
  defineButtonElements()
  definePopoverElements()
  defineCollapsibleElements()
  createParts(badgeButton, {
    root: { tag: "x-badge-button", target: wrappedButton, display: "contents" },
  })
})

test("a button two parts bind keeps the inner part's data-slot, however it arrives", async () => {
  const parsed = document.getElementById("parsed")!
  document.body.insertAdjacentHTML(
    "beforeend",
    `<ui-popover>
      <ui-popover-trigger><ui-button><button>Share</button></ui-button></ui-popover-trigger>
      <ui-popover-content>Link copied</ui-popover-content>
    </ui-popover>
    <ui-collapsible>
      <ui-collapsible-trigger><ui-button><button>Closed</button></ui-button></ui-collapsible-trigger>
      <ui-collapsible-panel>Panel</ui-collapsible-panel>
    </ui-collapsible>
    <ui-collapsible default-open>
      <ui-collapsible-trigger><ui-button><button>Open</button></ui-button></ui-collapsible-trigger>
      <ui-collapsible-panel>Panel</ui-collapsible-panel>
    </ui-collapsible>
    <x-badge-button><ui-button><button>Written</button></ui-button></x-badge-button>`
  )
  const slots = () =>
    Object.fromEntries(
      [...document.querySelectorAll("button")].map((button) => [
        button.textContent,
        button.dataset.slot,
      ])
    )
  const all = {
    Parsed: "button",
    Share: "button",
    Closed: "button",
    Open: "button",
    Written: "button",
  }
  await wait(50)
  expect(slots()).toEqual(all)
  for (const el of document.querySelectorAll("ui-collapsible")) {
    const collapsible = el as HTMLElement & { open: boolean }
    collapsible.open = !collapsible.open
  }
  const parsedButton = parsed.querySelector("ui-button") as HTMLElement & {
    disabled: boolean
  }
  parsedButton.disabled = true
  await wait(50)
  expect(slots()).toEqual(all)
})
