// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { tabs } from "../src/components/tabs/tabs"
import { bind } from "../src/foundation/kernel/part"

const cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup())
  document.body.replaceChildren()
})

const tick = () => new Promise((resolve) => setTimeout(resolve))

test("the indicator stops watching tabs that left the page", async () => {
  const observed = new Set<Element>()
  const original = window.ResizeObserver
  window.ResizeObserver = class {
    observe(target: Element) {
      observed.add(target)
    }
    unobserve(target: Element) {
      observed.delete(target)
    }
    disconnect() {
      observed.clear()
    }
  } as unknown as typeof ResizeObserver
  cleanups.push(() => (window.ResizeObserver = original))
  const instance = tabs({ id: "t", defaultValue: "a" })
  const list = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("list", {}), list)!)
  const unbind = new Map<string, () => void>()
  const els = new Map<string, HTMLElement>()
  for (const value of ["a", "b", "c"]) {
    const el = list.appendChild(document.createElement("button"))
    el.setAttribute("role", "tab")
    els.set(value, el)
    unbind.set(value, bind(instance.part("tab", { value }), el)!)
  }
  cleanups.push(
    bind(
      instance.part("indicator", {}),
      list.appendChild(document.createElement("span"))
    )!
  )
  await tick()
  expect(observed.has(els.get("c")!)).toBe(true)
  els.get("c")!.remove()
  unbind.get("c")!()
  await tick()
  expect(observed.has(els.get("c")!)).toBe(false)
  // Back on the page, it's watched again, which a set still holding it would skip.
  list.append(els.get("c")!)
  unbind.set("c", bind(instance.part("tab", { value: "c" }), els.get("c")!)!)
  await tick()
  expect(observed.has(els.get("c")!)).toBe(true)
  for (const value of ["a", "b", "c"]) {
    unbind.get(value)!()
  }
})

test("the indicator keeps its box while an ancestor hides the list", async () => {
  let resized = () => {}
  const original = window.ResizeObserver
  window.ResizeObserver = class {
    constructor(callback: () => void) {
      resized = callback
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  cleanups.push(() => (window.ResizeObserver = original))
  const instance = tabs({ id: "t", defaultValue: "a" })
  const list = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("list", {}), list)!)
  const tab = list.appendChild(document.createElement("button"))
  tab.setAttribute("role", "tab")
  cleanups.push(bind(instance.part("tab", { value: "a" }), tab)!)
  const indicator = list.appendChild(document.createElement("span"))
  cleanups.push(bind(instance.part("indicator", {}), indicator)!)
  await tick()
  const writes: string[] = []
  const write = indicator.style.setProperty.bind(indicator.style)
  indicator.style.setProperty = (name, ...rest) => {
    writes.push(name)
    write(name, ...rest)
  }
  let visible = false
  list.checkVisibility = () => visible
  resized()
  expect(writes).toEqual([])
  visible = true
  resized()
  expect(writes.length).toBeGreaterThan(0)
})
