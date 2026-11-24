// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineAccordionElements } from "../src/accordion"
import { createAgent } from "../src/agent"
import { defineCheckboxElements } from "../src/checkbox"
import { defineCollapsibleElements } from "../src/collapsible"
import { defineTabsElements } from "../src/tabs"

const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineAccordionElements()
  defineCheckboxElements()
  defineCollapsibleElements()
  defineTabsElements()
})

const gift = { ref: "Gift wrap", action: "setChecked", args: [true] }
const field = "<label><ui-checkbox></ui-checkbox> Gift wrap</label>"

const places = (mark: string) => ({
  collapsible: `
    <ui-collapsible>
      <ui-collapsible-trigger ${mark}><button>More options</button></ui-collapsible-trigger>
      <ui-collapsible-panel>${field}</ui-collapsible-panel>
    </ui-collapsible>`,
  tab: `
    <ui-tabs default-value="general">
      <ui-tabs-list aria-label="Settings">
        <ui-tabs-tab value="general"><button>General</button></ui-tabs-tab>
        <ui-tabs-tab value="gifts" ${mark}><button>Gifts</button></ui-tabs-tab>
      </ui-tabs-list>
      <ui-tabs-panel value="general">Nothing here</ui-tabs-panel>
      <ui-tabs-panel value="gifts">${field}</ui-tabs-panel>
    </ui-tabs>`,
  "accordion section": `
    <ui-accordion>
      <ui-accordion-item value="gifts">
        <ui-accordion-trigger ${mark}><button>Gifts</button></ui-accordion-trigger>
        <ui-accordion-panel>${field}</ui-accordion-panel>
      </ui-accordion-item>
    </ui-accordion>`,
})

const names = ["collapsible", "tab", "accordion section"] as const

test.each(names)(
  "a %s inside data-agent-confirm isn't opened to look",
  async (name) => {
    document.body.innerHTML = places(
      'data-agent-confirm="Shows the gift options"'
    )[name]
    await wait()
    const before = document.body.innerHTML
    const outcome = await createAgent().act({ steps: [gift] })
    expect(outcome.ok).toBe(false)
    expect(document.body.innerHTML).toBe(before)
  }
)

test.each(names)("a %s with no mark opens for the step", async (name) => {
  document.body.innerHTML = places("")[name]
  await wait()
  const outcome = await createAgent().act({ steps: [gift] })
  expect(outcome.ok, outcome.error?.message).toBe(true)
})
