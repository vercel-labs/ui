// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest"
import { autocomplete } from "../src/components/autocomplete/autocomplete"
import { combobox } from "../src/components/combobox/combobox"
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

function mountSheet(
  instance: {
    part(slot: string, props?: { value: string }): Parameters<typeof bind>[0]
    destroy(): void
  },
  { trigger, input: name }: { trigger?: string; input: string }
) {
  const viewport = document.createElement("div")
  const content = document.createElement("div")
  const header = document.createElement("div")
  const input = document.createElement("input")
  input.setAttribute("aria-label", name)
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
  document.body.append(viewport)
  const bound = [
    bind(instance.part("viewport"), viewport),
    bind(instance.part("content"), content),
    bind(instance.part("header"), header),
    bind(instance.part("input"), input),
    bind(instance.part("list"), list),
    ...items.map(({ value, item }) =>
      bind(instance.part("item", { value }), item)
    ),
  ]
  if (trigger) {
    const button = document.createElement("button")
    button.textContent = trigger
    document.body.prepend(button)
    bound.push(bind(instance.part("trigger"), button))
  }
  cleanups.push(...bound, () => instance.destroy())
  return content
}

const sheet = {
  items: ["Apple", "Mango"],
  presentation: "sheet" as const,
  defaultOpen: true,
}

test("an autocomplete open as a sheet keeps its field's name", async () => {
  const agent = createAgent()
  const content = mountSheet(autocomplete({ id: "fruit", ...sheet }), {
    input: "Fruit",
  })
  await vi.waitFor(() => expect(content.hidden).toBe(false))
  expect(agent.snapshot()[0]).toMatchObject({
    component: "autocomplete",
    label: "Fruit",
  })
})

test("a combobox open as a sheet keeps its trigger's name over its search field", async () => {
  const agent = createAgent()
  const content = mountSheet(combobox({ id: "country", ...sheet }), {
    trigger: "Country",
    input: "Search countries",
  })
  await vi.waitFor(() => expect(content.hidden).toBe(false))
  expect(agent.snapshot()[0]).toMatchObject({
    component: "combobox",
    label: "Country",
  })
})
