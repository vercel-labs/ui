// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { lockScroll } from "../src/foundation/popups/modal"

let release = () => {}
let button: HTMLButtonElement
let clicks = 0

beforeEach(() => {
  vi.spyOn(navigator, "platform", "get").mockReturnValue("iPad")
  const dialog = document.createElement("dialog")
  button = document.createElement("button")
  button.addEventListener("click", () => clicks++)
  clicks = 0
  dialog.append(button)
  document.body.append(dialog)
  release = lockScroll(document, dialog)
})

afterEach(() => {
  release()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

function touch(type: string, y: number) {
  const point = { clientX: 10, clientY: y }
  const event = Object.assign(
    new Event(type, { bubbles: true, cancelable: true }),
    type === "touchend"
      ? { touches: [], changedTouches: [point] }
      : { touches: [point], changedTouches: [point] }
  )
  button.dispatchEvent(event)
  return event.defaultPrevented
}

test("on iOS, a tap that wobbles on a modal's button still clicks once", () => {
  touch("touchstart", 10)
  expect(touch("touchmove", 12)).toBe(true)
  expect(touch("touchend", 12)).toBe(true)
  expect(clicks).toBe(1)
})

test("on iOS, a drag on a modal's button is stopped and doesn't click", () => {
  touch("touchstart", 10)
  expect(touch("touchmove", 12)).toBe(true)
  expect(touch("touchmove", 40)).toBe(true)
  expect(touch("touchend", 40)).toBe(false)
  expect(clicks).toBe(0)
})

test("on iOS, a tap that doesn't move is left to the browser", () => {
  touch("touchstart", 10)
  expect(touch("touchend", 10)).toBe(false)
  expect(clicks).toBe(0)
})
