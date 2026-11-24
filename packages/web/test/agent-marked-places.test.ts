// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { defineCheckboxElements } from "../src/checkbox"
import { defineCollapsibleElements } from "../src/collapsible"

const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  const internals = (
    globalThis as { ElementInternals?: { prototype: Record<string, unknown> } }
  ).ElementInternals?.prototype
  if (internals) {
    internals.setFormValue ??= () => {}
    internals.setValidity ??= () => {}
  }
  defineCheckboxElements()
  defineCollapsibleElements()
})

const gift = { ref: "Gift wrap", action: "setChecked", args: [true] }

test("a collapsible whose trigger is inside data-agent-confirm isn't opened to look", async () => {
  document.body.innerHTML = `
    <ui-collapsible>
      <ui-collapsible-trigger data-agent-confirm="Shows the gift options"><button>More options</button></ui-collapsible-trigger>
      <ui-collapsible-panel><label><ui-checkbox></ui-checkbox> Gift wrap</label></ui-collapsible-panel>
    </ui-collapsible>`
  await wait()
  const outcome = await createAgent().act({ steps: [gift] })
  expect(outcome.ok).toBe(false)
  expect(
    (
      document.querySelector("ui-collapsible") as HTMLElement & {
        open: boolean
      }
    ).open
  ).toBe(false)
})

test("a collapsible with no mark still opens for the step", async () => {
  document.body.innerHTML = `
    <ui-collapsible>
      <ui-collapsible-trigger><button>More options</button></ui-collapsible-trigger>
      <ui-collapsible-panel><label><ui-checkbox></ui-checkbox> Gift wrap</label></ui-collapsible-panel>
    </ui-collapsible>`
  await wait()
  const outcome = await createAgent().act({ steps: [gift] })
  expect(outcome.ok, outcome.error?.message).toBe(true)
})
