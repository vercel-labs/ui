import type { Page } from "@playwright/test"

// Inputs are found by role and the field's label. Buttons by their own labels.
const quantity = (page: Page) =>
  page.getByRole("textbox", { name: "Quantity", exact: true })
const amount = (page: Page) =>
  page.getByRole("textbox", { name: "Amount", exact: true })
const button = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true })

async function status(
  page: Page,
  name: "Last action" | "Committed" | "Submitted"
) {
  return page.getByRole("status", { name }).textContent()
}

// The scrub area has no role. It's found by its text.
const scrubArea = (page: Page) =>
  page.getByText("Drag to adjust", { exact: true })

// Automation can't move a locked pointer: headless Chromium on Linux grants the
// lock and then reports no movement, and Firefox stops taking moves. This
// stand-in locks the way the spec describes, asynchronously with
// `pointerlockchange`, but leaves the mouse free. While it's locked, each move
// reports how far the mouse went in `movementX` and `movementY`, as a locked
// pointer's moves do, measured here because WebKit's automated moves report
// none. It measures client positions, which follow the free mouse in every
// engine: measured by screen position, WebKit on Linux stepped a scrub only
// for the moves before the lock. With `refuse`, every request fails, as
// Safari's can.
async function standInPointerLock(page: Page, { refuse = false } = {}) {
  await page.evaluate((refuse) => {
    let lockedElement: Element | null = null
    const announce = (type: "pointerlockchange" | "pointerlockerror") =>
      document.dispatchEvent(new Event(type))
    Object.defineProperty(document, "pointerLockElement", {
      configurable: true,
      get: () => lockedElement,
    })

    // Each move's distance from the one before, recorded before any page listener runs.
    const movements = new WeakMap<Event, { x: number; y: number }>()
    let last: { x: number; y: number } | null = null
    window.addEventListener(
      "pointermove",
      (event) => {
        if (last) {
          movements.set(event, {
            x: event.clientX - last.x,
            y: event.clientY - last.y,
          })
        }
        last = { x: event.clientX, y: event.clientY }
      },
      { capture: true }
    )
    for (const axis of ["x", "y"] as const) {
      const property = axis === "x" ? "movementX" : "movementY"
      const reported = Object.getOwnPropertyDescriptor(
        MouseEvent.prototype,
        property
      )!.get!
      Object.defineProperty(MouseEvent.prototype, property, {
        configurable: true,
        get(this: MouseEvent) {
          const movement = lockedElement && movements.get(this)
          return movement ? movement[axis] : reported.call(this)
        },
      })
    }

    Element.prototype.requestPointerLock = function (this: Element) {
      return new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          if (refuse) {
            announce("pointerlockerror")
            return reject(new DOMException("Refused.", "NotSupportedError"))
          }
          lockedElement = this
          announce("pointerlockchange")
          resolve()
        })
      )
    }
    document.exitPointerLock = () => {
      lockedElement = null
      announce("pointerlockchange")
    }
  }, refuse)
}

async function save(page: Page) {
  await page.getByRole("button", { name: "Save" }).click()
}

export { amount, button, quantity, save, scrubArea, standInPointerLock, status }
