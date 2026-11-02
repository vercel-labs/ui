// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { toastRegion } from "../src/components/toast/toast"
import { createToaster } from "../src/components/toast/toaster"

globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

let cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  document.body.replaceChildren()
})

const touch = (type: string, y: number, pointerId = 1) =>
  new PointerEvent(type, {
    clientX: 0,
    clientY: y,
    pointerId,
    pointerType: "touch",
    isPrimary: pointerId === 1,
    button: 0,
    buttons: type === "pointerup" ? 0 : 1,
    bubbles: true,
  })

const frame = () => new Promise((resolve) => requestAnimationFrame(resolve))

// A toast at the bottom of the page, which swipes down to dismiss.
function mountToast() {
  const toaster = createToaster()
  const region = toastRegion({ id: "r", toaster })
  const disconnect = region.api.internal.connect()
  const id = toaster("Saved", { duration: Infinity })
  const el = document.body.appendChild(document.createElement("div"))
  const unbind = region.api.internal.bindToast(el, id)
  cleanups.push(unbind, disconnect, () => region.destroy())
  return { region, el }
}

test("a second finger can't start another swipe of a toast while one swipes it", async () => {
  const { el } = mountToast()
  el.dispatchEvent(touch("pointerdown", 0))
  document.dispatchEvent(touch("pointermove", 20))
  document.dispatchEvent(touch("pointermove", 30))
  await frame()
  const offset = el.style.getPropertyValue("--toast-swipe-y")
  expect(offset).not.toBe("")
  el.dispatchEvent(touch("pointerdown", 0, 2))
  document.dispatchEvent(touch("pointermove", 60, 2))
  document.dispatchEvent(touch("pointermove", 90, 2))
  await frame()
  expect(el.style.getPropertyValue("--toast-swipe-y")).toBe(offset)
})

test("a swipe cut short by its region going away lets go of the toast", async () => {
  const { region, el } = mountToast()
  el.dispatchEvent(touch("pointerdown", 0))
  document.dispatchEvent(touch("pointermove", 20))
  await frame()
  expect(el.hasAttribute("data-swiping")).toBe(true)
  region.destroy()
  expect(el.hasAttribute("data-swiping")).toBe(false)
  // The pointer no longer reaches it.
  document.dispatchEvent(touch("pointermove", 80))
  await frame()
  expect(el.style.getPropertyValue("--toast-swipe-y")).not.toBe("80px")
})
