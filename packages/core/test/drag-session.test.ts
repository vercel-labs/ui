// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest"
import { numberInput } from "../src/components/number-input/number-input"
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
