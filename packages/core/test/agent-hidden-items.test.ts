// @vitest-environment jsdom
// An agent reaches the items a person can: not one in a hidden part of the
// page, like a folded column, though one in its list's closed content is.
import { afterEach, expect, test } from "vitest"
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
