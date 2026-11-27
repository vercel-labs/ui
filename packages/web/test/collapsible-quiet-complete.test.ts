// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineCollapsibleElements } from "../src/collapsible"

const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  defineCollapsibleElements()
})

test("a collapsible opened and closed by its property reports each end without an animation", async () => {
  document.body.innerHTML = `
    <ui-collapsible>
      <ui-collapsible-trigger><button>Details</button></ui-collapsible-trigger>
      <ui-collapsible-panel>Panel</ui-collapsible-panel>
    </ui-collapsible>`
  await wait()
  const collapsible = document.querySelector(
    "ui-collapsible"
  )! as HTMLElement & {
    open: boolean
  }
  const events: string[] = []
  collapsible.addEventListener("openchange", () => events.push("openchange"))
  collapsible.addEventListener("openchangecomplete", (event) =>
    events.push(
      `complete ${(event as CustomEvent<{ value: boolean }>).detail.value}`
    )
  )
  collapsible.open = true
  await wait()
  collapsible.open = false
  await wait()
  expect(events).toEqual(["complete true", "complete false"])
})
