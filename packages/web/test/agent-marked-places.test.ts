// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineAccordionElements } from "../src/accordion"
import { createAgent } from "../src/agent"
import { defineCheckboxElements } from "../src/checkbox"
import { defineCollapsibleElements } from "../src/collapsible"
import { defineMenuElements } from "../src/menu"
import { defineTabsElements } from "../src/tabs"

const wait = () => new Promise((resolve) => setTimeout(resolve, 20))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  Element.prototype.scrollIntoView ??= () => {}
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineAccordionElements()
  defineCheckboxElements()
  defineCollapsibleElements()
  defineMenuElements()
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

test("a mark on a collapsible's trigger asks before any step opens it, and shows in the snapshot", async () => {
  document.body.innerHTML = places(
    'data-agent-confirm="Shows the gift options"'
  ).collapsible
  await wait()
  const agent = createAgent()
  expect(agent.snapshot()[0].confirm).toBe("Shows the gift options")
  for (const step of [
    { ref: "More options", action: "setOpen", args: [true] },
    { ref: "More options", action: "press" },
  ]) {
    const outcome = await agent.act({ steps: [step] })
    expect(outcome.error?.message).toMatch(/^Needs a person: /)
  }
  expect(document.querySelector("ui-collapsible")).toHaveProperty("open", false)
})

test("a mark on one menu item asks for that item only", async () => {
  document.body.innerHTML = `
    <ui-menu>
      <ui-menu-trigger><button>Project</button></ui-menu-trigger>
      <ui-menu-content>
        <ui-menu-item>Rename</ui-menu-item>
        <ui-menu-item data-agent-confirm="Deletes the project">Delete</ui-menu-item>
      </ui-menu-content>
    </ui-menu>`
  await wait()
  const agent = createAgent()
  expect(agent.snapshot()[0].confirm).toBeUndefined()
  const press = (text: string) =>
    agent.act({ steps: [{ ref: "Project", action: "press", args: [text] }] })
  expect((await press("Rename")).ok).toBe(true)
  expect((await press("Delete")).error?.message).toMatch(/^Needs a person: /)
})
