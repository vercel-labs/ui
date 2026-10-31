// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest"
import { resizable } from "../src/components/resizable/resizable"
import { bind, liveAttrs } from "../src/foundation/kernel/part"

const cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup())
  document.body.replaceChildren()
})

test("a panel whose minimum grows past its size while mounted grows to it", async () => {
  const instance = resizable({ id: "g" })
  const root = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root", {}), root)!)
  const element = () => root.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("panel", { id: "a", defaultSize: 20, minSize: 10 }), element())!)
  cleanups.push(bind(instance.part("handle", { id: "h" }), element())!)
  cleanups.push(bind(instance.part("panel", { id: "b" }), element())!)
  await Promise.resolve()
  expect(instance.api.getLayout()).toEqual([20, 80])
  instance.part("panel", { id: "a", defaultSize: 20, minSize: 40 })
  await Promise.resolve()
  expect(instance.api.getLayout()).toEqual([40, 60])
  expect(liveAttrs(instance.part("handle", { id: "h" }))["aria-valuemin"]).toBe("40")
})

test("a controlled layout is asked to grow a panel whose minimum grows past it", async () => {
  const onLayoutChange = vi.fn()
  const instance = resizable({ id: "g", layout: [20, 80], onLayoutChange })
  const root = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root", {}), root)!)
  const element = () => root.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("panel", { id: "a", minSize: 10 }), element())!)
  cleanups.push(bind(instance.part("handle", { id: "h" }), element())!)
  cleanups.push(bind(instance.part("panel", { id: "b" }), element())!)
  await Promise.resolve()
  instance.part("panel", { id: "a", minSize: 40 })
  await Promise.resolve()
  expect(onLayoutChange).toHaveBeenCalledTimes(1)
  expect(onLayoutChange).toHaveBeenCalledWith([40, 60], expect.objectContaining({ reason: "resize" }))
})

test("a controlled owner that ignores a bounds resize can still be asked for a later one", async () => {
  const onLayoutChange = vi.fn()
  const instance = resizable({ id: "g", layout: [20, 80], onLayoutChange })
  const root = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root", {}), root)!)
  const element = () => root.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("panel", { id: "a", minSize: 10 }), element())!)
  cleanups.push(bind(instance.part("handle", { id: "h" }), element())!)
  cleanups.push(bind(instance.part("panel", { id: "b" }), element())!)
  await Promise.resolve()
  instance.part("panel", { id: "a", minSize: 40 })
  await Promise.resolve()
  instance.part("panel", { id: "a", minSize: 10 })
  await Promise.resolve()
  onLayoutChange.mockClear()
  instance.api.resize("a", 40)
  expect(onLayoutChange).toHaveBeenCalledWith([40, 60], expect.objectContaining({ reason: "imperative" }))
})

test("bounds that change on two panels in one render ask a controlled owner once, after the render", async () => {
  const onLayoutChange = vi.fn()
  const instance = resizable({ id: "g", layout: [20, 80], onLayoutChange })
  const root = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root", {}), root)!)
  const element = () => root.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("panel", { id: "a", minSize: 10 }), element())!)
  cleanups.push(bind(instance.part("handle", { id: "h" }), element())!)
  cleanups.push(bind(instance.part("panel", { id: "b" }), element())!)
  await Promise.resolve()
  instance.part("panel", { id: "a", minSize: 40 })
  instance.part("panel", { id: "b", maxSize: 50 })
  expect(onLayoutChange).not.toHaveBeenCalled()
  await Promise.resolve()
  expect(onLayoutChange).toHaveBeenCalledTimes(1)
  expect(onLayoutChange).toHaveBeenCalledWith([50, 50], expect.objectContaining({ reason: "resize" }))
})
