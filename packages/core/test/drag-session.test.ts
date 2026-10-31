// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest"
import { numberInput } from "../src/components/number-input/number-input"
import { slider } from "../src/components/slider/slider"
import { createScrollbarInput, type ScrollbarHost } from "../src/components/scroll-area/scroll-area-pointer"
import { createArea, definePrimitive } from "../src/index"
import { createDragSession } from "../src/foundation/drag-and-drop/pointer"
import { mount } from "../src/testing/mount"

let destroy: (() => void)[] = []
afterEach(() => {
  destroy.splice(0).forEach((cleanup) => cleanup())
  document.body.replaceChildren()
})

const press = (type: string, init: PointerEventInit = {}) =>
  new PointerEvent(type, {
    pointerId: 1,
    pointerType: "touch",
    isPrimary: true,
    button: 0,
    buttons: type === "pointerup" ? 0 : 1,
    bubbles: true,
    ...init,
  })

function session() {
  const el = document.createElement("div")
  document.body.append(el)
  const drags = createDragSession((cleanup) => destroy.push(cleanup))
  const drag = (down: PointerEvent, onStart?: () => boolean | void) => {
    const onEnd = vi.fn()
    if (!drags.accepts(down)) return undefined
    drags.start(el, down, { onStart, onMove: () => {}, onEnd })
    return onEnd
  }
  return { drags, drag }
}

describe("createDragSession", () => {
  test("ignores a second finger while one drags, and takes the next press once it lifts", () => {
    const { drag } = session()
    const first = drag(press("pointerdown"))!
    expect(drag(press("pointerdown", { pointerId: 2, isPrimary: false }))).toBeUndefined()
    document.dispatchEvent(press("pointerup"))
    expect(first).toHaveBeenCalledWith(expect.anything(), false)
    expect(drag(press("pointerdown", { pointerId: 3 }))).toBeDefined()
  })

  test("ignores a press with another button", () => {
    const { drag } = session()
    expect(drag(press("pointerdown", { pointerType: "mouse", button: 2 }))).toBeUndefined()
  })

  test("ends a drag as canceled when its component goes away", () => {
    const { drag } = session()
    const onEnd = drag(press("pointerdown"))!
    destroy.splice(0).forEach((cleanup) => cleanup())
    expect(onEnd).toHaveBeenCalledWith(expect.anything(), true)
    // The pointer no longer reaches it.
    document.dispatchEvent(press("pointerup"))
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  test("ends a drag as canceled through cancel", () => {
    const { drags, drag } = session()
    const onEnd = drag(press("pointerdown"))!
    drags.cancel()
    expect(onEnd).toHaveBeenCalledWith(expect.anything(), true)
  })

  test("a drag that refuses to start leaves the way clear for the next press", () => {
    const { drag } = session()
    drag(press("pointerdown", { pointerType: "mouse" }), () => false)
    document.dispatchEvent(press("pointermove", { pointerType: "mouse", clientX: 20 }))
    expect(drag(press("pointerdown", { pointerType: "mouse", pointerId: 2 }))).toBeDefined()
  })

  test("a new press of the same kind ends a drag that missed its release", () => {
    const { drag } = session()
    const stale = drag(press("pointerdown", { pointerType: "mouse" }))!
    const next = drag(press("pointerdown", { pointerType: "mouse", pointerId: 2 }))
    expect(stale).toHaveBeenCalledWith(expect.anything(), true)
    expect(next).toBeDefined()
  })
})

test("a held stepper stops stepping once its number input leaves the page", () => {
  vi.useFakeTimers()
  try {
    const input = mount(
      numberInput,
      { defaultValue: 0 },
      `<root><group><control as="input" aria-label="Quantity"></control><increment>More</increment></group></root>`,
    )
    input.part("increment")!.dispatchEvent(press("pointerdown", { pointerType: "mouse" }))
    expect(input.state.value).toBe(1)
    input.unmount()
    vi.advanceTimersByTime(2000)
    expect(input.state.value).toBe(1)
  } finally {
    vi.useRealTimers()
  }
})

const frame = () => new Promise((resolve) => requestAnimationFrame(resolve))

function mountSlider(options: object) {
  const mounted = mount(
    slider,
    { defaultValue: 0, ...options },
    `<root><control><track></track></control></root>`,
  )
  mounted.part("track")!.getBoundingClientRect = () => new DOMRect(0, 0, 100, 10)
  return mounted
}

test("a slider that leaves the page mid-drag commits nothing", async () => {
  const onValueCommit = vi.fn()
  const mounted = mountSlider({ onValueCommit })
  mounted.part("control")!.dispatchEvent(press("pointerdown", { clientX: 10, clientY: 5 }))
  document.dispatchEvent(press("pointermove", { clientX: 60, clientY: 5 }))
  await frame()
  expect(mounted.state.value).toBe(60)
  mounted.unmount()
  expect(onValueCommit).not.toHaveBeenCalled()
})

test("a new press on a slider ends a drag that missed its release, and takes over", async () => {
  const onValueCommit = vi.fn()
  const mounted = mountSlider({ onValueCommit })
  destroy.push(mounted.unmount)
  mounted.part("control")!.dispatchEvent(press("pointerdown", { clientX: 10, clientY: 5 }))
  expect(mounted.state.value).toBe(10)
  mounted.part("control")!.dispatchEvent(press("pointerdown", { pointerId: 2, clientX: 80, clientY: 5 }))
  expect(mounted.state.value).toBe(80)
  expect(onValueCommit).toHaveBeenCalledTimes(1)
  document.dispatchEvent(press("pointerup", { pointerId: 2, clientX: 80, clientY: 5 }))
  expect(onValueCommit).toHaveBeenCalledTimes(2)
})

test("a held stepper commits nothing when its number input leaves the page", () => {
  vi.useFakeTimers()
  try {
    const onValueCommit = vi.fn()
    const input = mount(
      numberInput,
      { defaultValue: 0, onValueCommit },
      `<root><group><control as="input" aria-label="Quantity"></control><increment>More</increment></group></root>`,
    )
    input.part("increment")!.dispatchEvent(press("pointerdown", { pointerType: "mouse" }))
    expect(input.state.value).toBe(1)
    input.unmount()
    expect(onValueCommit).not.toHaveBeenCalled()
  } finally {
    vi.useRealTimers()
  }
})

test("an area that leaves the page mid-drag commits nothing", async () => {
  const onCommit = vi.fn()
  const board = definePrimitive({
    name: "board",
    options: {},
    state: (_options: {}) => ({ value: { x: 0, y: 0 } }),
    api: (context) => ({
      area: createArea(context, {
        value: (state) => state.value,
        set: (value) => (context.store.set({ value }), true),
        onCommit,
      }),
    }),
    slots: (slot) => ({ root: slot({}) }),
  })
  const instance = board({ id: "b" })
  const el = document.body.appendChild(document.createElement("div"))
  el.getBoundingClientRect = () => new DOMRect(0, 0, 100, 100)
  instance.api.area.pointerdown(press("pointerdown", { clientX: 10, clientY: 10, cancelable: true }), el)
  document.dispatchEvent(press("pointermove", { clientX: 60, clientY: 60 }))
  await frame()
  expect(instance.get().value.x).toBeCloseTo(0.6)
  instance.destroy()
  expect(onCommit).not.toHaveBeenCalled()
})

test("a second finger on a slider mid-drag leaves the value to the first", async () => {
  const mounted = mountSlider({})
  destroy.push(mounted.unmount)
  mounted.part("control")!.dispatchEvent(press("pointerdown", { clientX: 10, clientY: 5 }))
  mounted
    .part("control")!
    .dispatchEvent(press("pointerdown", { pointerId: 2, isPrimary: false, clientX: 80, clientY: 5 }))
  document.dispatchEvent(press("pointermove", { pointerId: 2, isPrimary: false, clientX: 90, clientY: 5 }))
  await frame()
  expect(mounted.state.value).toBe(10)
})

test("a held stepper that leaves the page stops for good, and its release commits nothing", () => {
  vi.useFakeTimers()
  try {
    const onValueCommit = vi.fn()
    const input = mount(
      numberInput,
      { defaultValue: 0, onValueCommit },
      `<root><group><control as="input" aria-label="Quantity"></control><increment>More</increment></group></root>`,
    )
    input.part("increment")!.dispatchEvent(press("pointerdown", { pointerType: "mouse" }))
    vi.advanceTimersByTime(1000)
    const held = input.state.value
    const removed = vi.spyOn(document, "removeEventListener")
    input.unmount()
    expect(vi.getTimerCount()).toBe(0)
    expect(removed.mock.calls.map(([type]) => type)).toContain("contextmenu")
    removed.mockRestore()
    document.dispatchEvent(press("pointerup", { pointerType: "mouse" }))
    vi.advanceTimersByTime(2000)
    expect(input.state.value).toBe(held)
    expect(onValueCommit).not.toHaveBeenCalled()
  } finally {
    vi.useRealTimers()
  }
})

test("a touch press while a mouse drags a slider leaves the drag to the mouse", () => {
  const mounted = mountSlider({})
  destroy.push(mounted.unmount)
  mounted
    .part("control")!
    .dispatchEvent(press("pointerdown", { pointerType: "mouse", clientX: 10, clientY: 5 }))
  mounted.part("control")!.dispatchEvent(press("pointerdown", { pointerId: 2, clientX: 80, clientY: 5 }))
  expect(mounted.state.value).toBe(10)
})

function scrollbar() {
  const viewport = document.body.appendChild(document.createElement("div"))
  const thumb = document.body.appendChild(document.createElement("div"))
  const metrics = {
    x: { position: 0, client: 100, scroll: 100 },
    y: { position: 100, client: 100, scroll: 1000 },
  }
  const host: ScrollbarHost = {
    viewport: () => viewport,
    metrics,
    track: { x: 0, y: 100 },
    rtl: () => false,
    measure() {},
    scrollTo: (axis, position) => void (metrics[axis].position = position),
    release() {},
    stopEasing() {},
    setDragging() {},
  }
  const unbind = createScrollbarInput(host).bindThumb(thumb, "y")
  thumb.dispatchEvent(press("pointerdown", { pointerType: "mouse", clientY: 10 }))
  document.dispatchEvent(press("pointermove", { pointerType: "mouse", clientY: 50 }))
  return { metrics, unbind }
}

test("a scrollbar thumb that leaves the page mid-drag leaves the content where the drag took it", async () => {
  const { metrics, unbind } = scrollbar()
  await frame()
  const dragged = metrics.y.position
  expect(dragged).toBeGreaterThan(100)
  unbind()
  expect(metrics.y.position).toBe(dragged)
})

test("Escape mid-drag still puts a scrollbar's content back where the drag began", async () => {
  const { metrics, unbind } = scrollbar()
  destroy.push(unbind)
  await frame()
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }))
  expect(metrics.y.position).toBe(100)
})
