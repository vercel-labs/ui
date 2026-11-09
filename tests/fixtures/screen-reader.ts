import type { Locator, Page } from "@playwright/test"

// A screen reader's double tap on a touch screen, as VoiceOver on iOS sends
// it: a touch with no size and no pressure, then a click. Chromium only, since
// it takes the DevTools protocol.
async function screenReaderTap(page: Page, target: Locator) {
  const box = await target.boundingBox()
  if (!box) {
    throw new Error("The element to tap isn't on screen.")
  }
  const cdp = await page.context().newCDPSession(page)
  await cdp.send("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 1,
  })
  const point = {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
    radiusX: 0,
    radiusY: 0,
    force: 0,
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [point],
  })
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  })
  await cdp.detach()
}

export { screenReaderTap }
