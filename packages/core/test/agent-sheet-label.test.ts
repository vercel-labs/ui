// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest"
import { autocomplete } from "../src/components/autocomplete/autocomplete"
import { bind } from "../src/foundation/kernel/part"
import { createAgent } from "../src/page/agent/agent"

HTMLElement.prototype.showPopover ??= function () {}
HTMLElement.prototype.hidePopover ??= function () {}
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as never
Element.prototype.animate ??= function () {
  return {
    finished: Promise.resolve(),
    onfinish: null,
    cancel() {},
    finish() {},
    pause() {},
    play() {},
    commitStyles() {},
  } as never
}

let cleanups: (() => void)[] = []

afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  document.body.innerHTML = ""
})

test("an autocomplete open as a sheet keeps its field's name", async () => {
  const agent = createAgent()
  const instance = autocomplete({
    id: "fruit",
    items: ["Apple", "Mango"],
    presentation: "sheet",
    defaultOpen: true,
  })
  const label = document.createElement("label")
  label.id = "fruit-label"
  label.textContent = "Fruit"
  const viewport = document.createElement("div")
  const content = document.createElement("div")
  const header = document.createElement("div")
  const input = document.createElement("input")
  input.setAttribute("aria-labelledby", "fruit-label")
  const list = document.createElement("div")
  const items = ["Apple", "Mango"].map((value) => {
    const item = document.createElement("div")
    item.textContent = value
    list.append(item)
    return { value, item }
  })
  header.append(input)
  content.append(header, list)
  viewport.append(content)
  document.body.append(label, viewport)
  cleanups.push(
    bind(instance.part("viewport"), viewport),
    bind(instance.part("content"), content),
    bind(instance.part("header"), header),
    bind(instance.part("input"), input),
    bind(instance.part("list"), list),
    ...items.map(({ value, item }) =>
      bind(instance.part("item", { value }), item)
    ),
    () => instance.destroy()
  )
  await vi.waitFor(() => expect(content.hidden).toBe(false))
  expect(agent.snapshot()[0]).toMatchObject({
    component: "autocomplete",
    label: "Fruit",
  })
})
