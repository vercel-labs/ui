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

test("a group that shrinks as a panel's pixel minimum changes fits the new minimum to the new size", async () => {
  let width = 1000
  const instance = resizable({ id: "g" })
  const root = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root", {}), root)!)
  const panel = () => {
    const el = root.appendChild(document.createElement("div"))
    el.getBoundingClientRect = () => new DOMRect(0, 0, width / 2, 10)
    return el
  }
  cleanups.push(bind(instance.part("panel", { id: "a", defaultSize: 40, minSize: "300px" }), panel())!)
  cleanups.push(bind(instance.part("handle", { id: "h" }), root.appendChild(document.createElement("div")))!)
  cleanups.push(bind(instance.part("panel", { id: "b" }), panel())!)
  await Promise.resolve()
  expect(instance.api.getLayout()).toEqual([40, 60])
  width = 500
  instance.part("panel", { id: "a", defaultSize: 40, minSize: "100px" })
  await Promise.resolve()
  expect(instance.api.getLayout()).toEqual([40, 60])
  expect(liveAttrs(instance.part("handle", { id: "h" }))["aria-valuemin"]).toBe("20")
})

test("a collapsed panel whose collapsedSize changes while mounted takes the new size", async () => {
  const instance = resizable({ id: "g" })
  const root = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root", {}), root)!)
  const element = () => root.appendChild(document.createElement("div"))
  const a = { id: "a", defaultSize: 40, minSize: 20, collapsible: true, collapsedSize: 0 }
  cleanups.push(bind(instance.part("panel", a), element())!)
  cleanups.push(bind(instance.part("handle", { id: "h" }), element())!)
  cleanups.push(bind(instance.part("panel", { id: "b" }), element())!)
  await Promise.resolve()
  instance.api.collapse("a")
  expect(instance.api.getLayout()).toEqual([0, 100])
  instance.part("panel", { ...a, collapsedSize: 10 })
  await Promise.resolve()
  expect(instance.api.getLayout()).toEqual([10, 90])
})

function mountDragging(options: Parameters<typeof resizable>[0] = { id: "g" }) {
  const instance = resizable(options)
  const root = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root", {}), root)!)
  const element = () => root.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("panel", { id: "a", defaultSize: 20, minSize: 10 }), element())!)
  cleanups.push(bind(instance.part("handle", { id: "h" }), element())!)
  cleanups.push(bind(instance.part("panel", { id: "b" }), element())!)
  return instance
}

test("a bounds change during a drag the owner cancels keeps the uncontrolled layout", async () => {
  const instance = mountDragging({ id: "g", onLayoutChange: (_layout, details) => details.cancel() })
  await Promise.resolve()
  instance.api.internal.startDrag(0, "h")
  instance.part("panel", { id: "a", defaultSize: 20, minSize: 40 })
  await Promise.resolve()
  expect(instance.api.getLayout()).toEqual([20, 80])
  instance.api.internal.endDrag()
  expect(instance.api.getLayout()).toEqual([20, 80])
})

test("a bounds change during a drag fits the next move and the drag's end, asking the owner each time", async () => {
  const onLayoutChange = vi.fn()
  const onLayoutCommit = vi.fn()
  const instance = mountDragging({ id: "g", onLayoutChange, onLayoutCommit })
  await Promise.resolve()
  instance.api.internal.startDrag(0, "h")
  instance.part("panel", { id: "a", defaultSize: 20, minSize: 40 })
  await Promise.resolve()
  expect(onLayoutChange).not.toHaveBeenCalled()
  instance.api.internal.dragBy(5)
  expect(instance.api.getLayout()).toEqual([40, 60])
  expect(onLayoutChange).toHaveBeenLastCalledWith([40, 60], expect.objectContaining({ reason: "drag" }))
  instance.part("panel", { id: "a", defaultSize: 20, minSize: 50 })
  await Promise.resolve()
  instance.api.internal.endDrag()
  expect(instance.api.getLayout()).toEqual([50, 50])
  expect(onLayoutChange).toHaveBeenLastCalledWith([50, 50], expect.objectContaining({ reason: "drag" }))
  expect(onLayoutCommit).toHaveBeenCalledTimes(1)
  expect(onLayoutCommit).toHaveBeenCalledWith([50, 50], expect.objectContaining({ reason: "drag" }))
})

test("space that changes a pixel minimum during a drag fits at the drag's end", async () => {
  const onLayoutChange = vi.fn()
  const instance = resizable({ id: "g", onLayoutChange })
  const root = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root", {}), root)!)
  const element = () => root.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("panel", { id: "a", defaultSize: 20, minSize: "100px" }), element())!)
  cleanups.push(bind(instance.part("handle", { id: "h" }), element())!)
  cleanups.push(bind(instance.part("panel", { id: "b" }), element())!)
  await Promise.resolve()
  instance.api.internal.setSpace(1000)
  expect(instance.api.getLayout()).toEqual([20, 80])
  instance.api.internal.startDrag(0, "h")
  instance.api.internal.setSpace(250)
  expect(instance.api.getLayout()).toEqual([20, 80])
  instance.api.internal.endDrag()
  expect(instance.api.getLayout()).toEqual([40, 60])
  expect(onLayoutChange).toHaveBeenLastCalledWith([40, 60], expect.objectContaining({ reason: "drag" }))
})

test("a group that grows as a panel's pixel minimum changes fits the new minimum to the new size", async () => {
  let width = 500
  const instance = resizable({ id: "g" })
  const root = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root", {}), root)!)
  const panel = () => {
    const el = root.appendChild(document.createElement("div"))
    el.getBoundingClientRect = () => new DOMRect(0, 0, width / 2, 10)
    return el
  }
  cleanups.push(bind(instance.part("panel", { id: "a", defaultSize: 40, minSize: "100px" }), panel())!)
  cleanups.push(bind(instance.part("handle", { id: "h" }), root.appendChild(document.createElement("div")))!)
  cleanups.push(bind(instance.part("panel", { id: "b" }), panel())!)
  await Promise.resolve()
  width = 1000
  instance.part("panel", { id: "a", defaultSize: 40, minSize: "300px" })
  await Promise.resolve()
  expect(instance.api.getLayout()).toEqual([40, 60])
  expect(liveAttrs(instance.part("handle", { id: "h" }))["aria-valuemin"]).toBe("30")
})

test("a render that keeps a panel's size props measures nothing", async () => {
  const instance = resizable({ id: "g" })
  const root = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root", {}), root)!)
  const measured = vi.fn(() => new DOMRect(0, 0, 250, 10))
  const panel = () => {
    const el = root.appendChild(document.createElement("div"))
    el.getBoundingClientRect = measured
    return el
  }
  cleanups.push(bind(instance.part("panel", { id: "a", defaultSize: 40, minSize: "100px" }), panel())!)
  cleanups.push(bind(instance.part("handle", { id: "h" }), root.appendChild(document.createElement("div")))!)
  cleanups.push(bind(instance.part("panel", { id: "b" }), panel())!)
  await Promise.resolve()
  measured.mockClear()
  instance.part("panel", { id: "a", defaultSize: 40, minSize: "100px" })
  instance.part("panel", { id: "b" })
  await Promise.resolve()
  expect(measured).not.toHaveBeenCalled()
  expect(instance.api.getLayout()).toEqual([40, 60])
})
