// @vitest-environment jsdom
import { expect, test, vi } from "vitest"
import { lockScroll } from "../src/foundation/popups/modal"

test("on iOS, a tap that wobbles on a modal's button still clicks, and a drag is stopped", () => {
  const platform = vi
    .spyOn(navigator, "platform", "get")
    .mockReturnValue("iPad")
  const dialog = document.createElement("dialog")
  const button = document.createElement("button")
  dialog.append(button)
  document.body.append(dialog)
  const release = lockScroll(document, dialog)
  const touch = (type: string, y: number) => {
    const event = Object.assign(
      new Event(type, { bubbles: true, cancelable: true }),
      { touches: [{ clientX: 10, clientY: y }] }
    )
    button.dispatchEvent(event)
    return event.defaultPrevented
  }
  try {
    touch("touchstart", 10)
    expect(touch("touchmove", 12)).toBe(false)
    expect(touch("touchmove", 30)).toBe(true)
  } finally {
    release()
    dialog.remove()
    platform.mockRestore()
  }
})
