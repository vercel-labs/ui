// @vitest-environment jsdom
// An agent reaches the items a person can: not one in a hidden part of the
// page, like a folded column, though one in its list's closed content is.
import { afterEach, expect, test } from "vitest"
import { accordion } from "../src/components/accordion/accordion"
import { navigationMenu } from "../src/components/navigation-menu/navigation-menu"
import { select } from "../src/components/select/select"
import { createAgent } from "../src/page/agent/agent"
import { bind } from "../src/foundation/kernel/part"
import { definePrimitive } from "../src/foundation/kernel/primitive"

let cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  document.body.innerHTML = ""
})

function mount(moved: string[]) {
  const board = definePrimitive({
    name: "board",
    options: {},
    state: () => ({}),
    api: () => ({ move: (value: string) => moved.push(value) }),
    slots: (slot) => ({
      root: slot({ attrs: () => ({ role: "group", "aria-label": "Board" }) }),
      item: slot<{ value: string }>({ props: { value: "string" } }),
    }),
    agent: { actions: ["move"] },
  })
  const instance = board({ id: "board" })
  const root = document.body.appendChild(document.createElement("div"))
  const folded = document.createElement("div")
  folded.hidden = true
  cleanups.push(bind(instance.part("root"), root), () => instance.destroy())
  for (const [value, label, parent] of [
    ["a", "Alpha card", root],
    ["h", "Hidden card", folded],
  ] as const) {
    const el = parent.appendChild(document.createElement("div"))
    el.textContent = label
    cleanups.push(bind(instance.part("item", { value }), el))
  }
  root.append(folded)
  return instance
}

test("a query doesn't list an item in a hidden part of the page", async () => {
  mount([])
  const agent = createAgent()
  const [found] = (await agent.query({ within: "Board" })) as {
    items: { value: string }[]
  }[]
  expect(found.items.map((item) => item.value)).toEqual(["a"])
})

test("a step doesn't reach an item in a hidden part of the page by its text", async () => {
  const moved: string[] = []
  mount(moved)
  await createAgent().act({
    steps: [{ ref: "Board", action: "move", args: ["Hidden card"] }],
  })
  expect(moved).not.toContain("h")
})

function mountRegion(hide: (item: HTMLElement) => void) {
  const instance = select({
    id: "region",
    items: [
      { value: "fra", label: "Frankfurt" },
      { value: "tyo", label: "Tokyo" },
    ],
  })
  const trigger = document.body.appendChild(document.createElement("button"))
  trigger.setAttribute("aria-label", "Region")
  cleanups.push(bind(instance.part("trigger"), trigger), () =>
    instance.destroy()
  )
  for (const [value, label, disabled] of [
    ["fra", "Frankfurt", true],
    ["tyo", "Tokyo", false],
  ] as const) {
    const item = document.body.appendChild(document.createElement("div"))
    item.textContent = label
    cleanups.push(bind(instance.part("item", { value, disabled }), item))
    if (disabled) {
      hide(item)
    }
  }
  return instance
}

test.each([
  ["itself", (item: HTMLElement) => (item.hidden = true)],
  [
    "by an ancestor",
    (item: HTMLElement) => {
      const folded = document.body.appendChild(document.createElement("div"))
      folded.hidden = true
      folded.append(item)
    },
  ],
])("setValue refuses a disabled option that is hidden %s", async (_, hide) => {
  const instance = mountRegion(hide)
  const outcome = await createAgent().act({
    steps: [{ ref: "Region", action: "setValue", args: ["fra"] }],
  })
  expect(outcome.ok).toBe(false)
  expect(instance.get().value).toBeNull()
})

// Sections with their triggers, "Billing" disabled through its trigger alone.
function mountSections(instance: {
  part: (slot: "item" | "trigger", props: object) => never
  destroy: () => void
}) {
  for (const [value, text, disabled] of [
    ["team", "Team", false],
    ["billing", "Billing", true],
  ] as const) {
    const item = document.body.appendChild(document.createElement("div"))
    const trigger = item.appendChild(document.createElement("button"))
    trigger.textContent = text
    cleanups.push(
      bind(instance.part("item", { value }), item),
      bind(instance.part("trigger", { value, disabled }), trigger)
    )
  }
  cleanups.push(() => instance.destroy())
}

test("a step doesn't open a navigation menu item whose trigger is disabled", async () => {
  const instance = navigationMenu({ id: "nav" })
  mountSections(instance as never)
  const outcome = await createAgent().act({
    steps: [{ ref: "navigation-menu", action: "setValue", args: ["billing"] }],
  })
  expect(outcome.ok).toBe(false)
  expect(instance.get().value).toBeNull()
})

test("a step doesn't open an accordion section whose trigger is disabled", async () => {
  const instance = accordion({ id: "settings" })
  mountSections(instance as never)
  const outcome = await createAgent().act({
    steps: [{ ref: "accordion", action: "open", args: ["billing"] }],
  })
  expect(outcome.ok).toBe(false)
  expect(instance.get().value).toEqual([])
})
