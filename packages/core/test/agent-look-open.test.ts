// @vitest-environment jsdom
// An agent's setValue opens only a list whose items show while it's open: not
// a component without an open state, and it doesn't wait on one kept closed.
import { afterEach, expect, test, vi } from "vitest"
import { select } from "../src/components/select/select"
import { createAgent } from "../src/page/agent/agent"
import { createChange } from "../src/foundation/kernel/input-source"
import { bind } from "../src/foundation/kernel/part"
import { definePrimitive } from "../src/foundation/kernel/primitive"

let cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  document.body.innerHTML = ""
})

function mount(open: boolean | undefined, opens: boolean[]) {
  const picker = definePrimitive({
    name: "picker",
    options: { value: "value", onValueChange: "callback" },
    controlled: ["value"],
    state: (options: {
      value?: string
      onValueChange?: (value: string) => void
    }) => ({
      value: options.value ?? "",
      ...(open === undefined ? {} : { open }),
    }),
    api: (context) => {
      const change = createChange(context)
      return {
        setValue: (value: string) =>
          change("value", value, { reason: "imperative" }),
        setOpen: (next: boolean) => opens.push(next),
      }
    },
    slots: (slot) => ({
      root: slot({ attrs: () => ({ role: "group", "aria-label": "Picker" }) }),
    }),
    agent: { actions: ["setValue"] },
  })
  const instance = picker({ id: "picker" })
  const el = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
  return instance
}

test("a component without an open state isn't opened to look", async () => {
  const opens: boolean[] = []
  const instance = mount(undefined, opens)
  const outcome = await createAgent().act({
    steps: [{ ref: "Picker", action: "setValue", args: ["two"] }],
  })
  expect(outcome.ok).toBe(true)
  expect(instance.get().value).toBe("two")
  expect(opens).toEqual([])
})

test("a list that stays closed isn't waited on, and is asked once", async () => {
  const opens: boolean[] = []
  mount(false, opens)
  const started = performance.now()
  await createAgent().act({
    steps: [{ ref: "Picker", action: "setValue", args: ["two"] }],
  })
  expect(performance.now() - started).toBeLessThan(800)
  expect(opens.filter(Boolean)).toHaveLength(1)
})

test("a multiple select whose items show only while open takes them by label", async () => {
  const content = document.body.appendChild(document.createElement("div"))
  const unbinds: (() => void)[] = []
  const instance: ReturnType<typeof select> = select({
    id: "tags",
    multiple: true,
    onOpenChange: (open) => {
      unbinds.splice(0).forEach((unbind) => unbind())
      content.replaceChildren()
      for (const value of open ? ["Bug", "Docs"] : []) {
        const item = content.appendChild(document.createElement("div"))
        item.textContent = value
        unbinds.push(bind(instance.part("item", { value }), item))
      }
    },
  })
  const trigger = document.body.appendChild(document.createElement("button"))
  trigger.setAttribute("aria-label", "Tags")
  cleanups.push(bind(instance.part("trigger"), trigger), () => {
    unbinds.forEach((unbind) => unbind())
    instance.destroy()
  })
  const outcome = await createAgent().act({
    steps: [{ ref: "Tags", action: "setValue", args: [["Bug", "Docs"]] }],
  })
  expect(outcome.error).toBeUndefined()
  expect(instance.get().value).toEqual(["Bug", "Docs"])
})

function mountSelect(modal = false) {
  Element.prototype.getAnimations ??= () => []
  const content = document.createElement("div")
  const unbinds: (() => void)[] = []
  const regions = ["Europe", "North America", "Asia"]
  const instance: ReturnType<typeof select> = select({
    id: "region",
    items: regions,
    defaultValue: "Europe",
    modal,
    onOpenChange: (open) => {
      unbinds.splice(0).forEach((unbind) => unbind())
      content.replaceChildren()
      content.remove()
      if (!open) {
        return
      }
      // A framework renders the open list after the change.
      queueMicrotask(() => {
        document.body.appendChild(content)
        unbinds.push(bind(instance.part("content"), content))
        for (const value of regions) {
          const item = content.appendChild(document.createElement("div"))
          item.textContent = value
          item.tabIndex = -1
          unbinds.push(bind(instance.part("item", { value }), item))
        }
      })
    },
  })
  const trigger = document.body.appendChild(document.createElement("button"))
  trigger.setAttribute("aria-label", "Region")
  cleanups.push(bind(instance.part("trigger"), trigger), () => {
    unbinds.forEach((unbind) => unbind())
    instance.destroy()
  })
  return instance
}

for (const modal of [false, true]) {
  test(`looking at a closed list's items moves no focus${modal ? ", modal" : ""}`, async () => {
    const instance = mountSelect(modal)
    const field = document.body.appendChild(document.createElement("input"))
    field.focus()
    const focus = vi.spyOn(HTMLElement.prototype, "focus")
    const inert: Element[] = []
    const watcher = new MutationObserver((records) =>
      inert.push(...records.map((record) => record.target as Element))
    )
    watcher.observe(document.body, {
      attributeFilter: ["inert"],
      subtree: true,
    })
    const outcome = await createAgent().act({
      steps: [{ ref: "Region", action: "setValue", args: ["North America"] }],
    })
    watcher.disconnect()
    const focused = focus.mock.contexts
    focus.mockRestore()
    expect(outcome.error).toBeUndefined()
    expect(instance.get().value).toBe("North America")
    expect(focused).toEqual([])
    expect(inert).toEqual([])
    expect(document.activeElement).toBe(field)
  })
}

test("looking at a closed list's items leaves focus on the page", async () => {
  const instance = mountSelect()
  const outcome = await createAgent().act({
    steps: [{ ref: "Region", action: "setValue", args: ["North America"] }],
  })
  expect(outcome.error).toBeUndefined()
  expect(instance.get().value).toBe("North America")
  expect(document.activeElement).toBe(document.body)
})
