import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// The core module itself, in layouts that move or scale a popup. It doesn't
// depend on the framework, so it runs once per engine: React on Chromium, web elsewhere.
test.beforeEach(async ({ framework, open, browserName }) => {
  test.skip(browserName === "chromium" && framework !== "react", "Framework independent.")
  await open("popover")
})

type Box = { x: number; y: number; width: number; height: number }

// Renders `html` into a stage, or the stage's shadow root, positions
// `#probe-popup` against `#probe-anchor` below its start, and returns both
// boxes once placed. `hostShadow` becomes the shadow root of `#probe-host`.
async function place(page: Page, html: string, shadow = false, hostShadow?: string) {
  await page.evaluate(
    async ({ html, shadow, hostShadow }) => {
      const stage = document.createElement("div")
      stage.id = "probe-stage"
      document.body.append(stage)
      if (shadow) stage.attachShadow({ mode: "open" }).innerHTML = html
      else stage.innerHTML = html
      if (hostShadow)
        stage.querySelector("#probe-host")!.attachShadow({ mode: "open" }).innerHTML = hostShadow
      const root = stage.shadowRoot ?? document
      const popup = root.querySelector<HTMLElement>("#probe-popup")!
      if (popup.hasAttribute("popover")) popup.showPopover()
      const { loadCoreModule } = window as unknown as {
        loadCoreModule: (name: string) => Promise<{
          position: (anchor: Element, el: HTMLElement, options: object) => () => void
        }>
      }
      const { position } = await loadCoreModule("position")
      const stop = position(root.querySelector("#probe-anchor")!, popup, { side: "bottom", align: "start" })
      Object.assign(window, { stopProbe: stop })
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    },
    { html, shadow, hostShadow },
  )
  return boxes(page)
}

// Scrolls `#probe-scroller`, in whichever shadow root has it, once the slow
// check has gone by, and returns how many frames the popup took to follow.
async function framesToFollow(page: Page) {
  await page.waitForTimeout(600)
  return page.evaluate(async () => {
    const stage = document.getElementById("probe-stage")!
    const root = stage.shadowRoot ?? document
    const scroller = (stage.shadowRoot ?? root.getElementById("probe-host")!.shadowRoot!).getElementById(
      "probe-scroller",
    )!
    scroller.scrollTop = 60
    const anchor = root.getElementById("probe-anchor")!
    const popup = root.getElementById("probe-popup")!
    for (let frame = 1; frame <= 30; frame++) {
      await new Promise(requestAnimationFrame)
      const a = anchor.getBoundingClientRect()
      if (Math.abs(popup.getBoundingClientRect().y - (a.bottom + 4)) < 1) return frame
    }
    return Infinity
  })
}

const boxes = (page: Page) =>
  page.evaluate(() => {
    const stage = document.getElementById("probe-stage")!
    const root = stage.shadowRoot ?? document
    const box = (selector: string) => {
      const { x, y, width, height } = root.querySelector(selector)!.getBoundingClientRect()
      return { x, y, width, height }
    }
    return { anchor: box("#probe-anchor"), popup: box("#probe-popup") }
  })

const popup = `<div id="probe-popup" popover="manual" style="width: 200px; height: 120px; padding: 0; border: 0; margin: 0"></div>`
const anchor = (style: string) => `<div id="probe-anchor" style="width: 80px; height: 30px; ${style}"></div>`

// Below the anchor's start, `gap` pixels away on screen.
function expectBelow({ anchor, popup }: { anchor: Box; popup: Box }, gap = 4) {
  expect(Math.abs(popup.x - anchor.x)).toBeLessThan(1)
  expect(Math.abs(popup.y - (anchor.y + anchor.height + gap))).toBeLessThan(1)
}

test("a popup stays where it was when its anchor leaves the page or stops rendering", async ({ page }) => {
  const placed = await place(page, anchor("position: fixed; left: 300px; top: 300px") + popup)
  expectBelow(placed)
  await page.evaluate(() => (document.getElementById("probe-anchor")!.style.display = "none"))
  await page.waitForTimeout(600)
  expect((await page.locator("#probe-popup").boundingBox())!).toMatchObject({
    x: placed.popup.x,
    y: placed.popup.y,
  })
  await page.evaluate(() => document.getElementById("probe-anchor")!.remove())
  await page.waitForTimeout(600)
  expect((await page.locator("#probe-popup").boundingBox())!).toMatchObject({
    x: placed.popup.x,
    y: placed.popup.y,
  })
})

test("a popup leaves with an anchor scrolled off screen sideways, touching its far edge", async ({
  page,
}) => {
  await place(
    page,
    `<div style="position: absolute; top: 0; left: 0; width: 4000px; height: 10px"></div>` +
      anchor("position: absolute; left: 300px; top: 300px") +
      popup,
  )
  await page.evaluate(() => window.scrollTo(900, 0))
  await expect
    .poll(async () => {
      const { anchor, popup } = await boxes(page)
      return Math.round(popup.x - (anchor.x + anchor.width))
    })
    .toBe(0)
})

test("a popup lines up with its anchor under CSS zoom, its offset zoomed too", async ({ page }) => {
  const placed = await place(page, `<div style="zoom: 1.5">${anchor("margin: 100px")}${popup}</div>`)
  expect(placed.popup.width).toBeCloseTo(300)
  expectBelow(placed, 6)
})

test("a popup rendered into a scaled container lines up with its anchor", async ({ page }) => {
  const placed = await place(
    page,
    anchor("position: fixed; left: 300px; top: 300px") +
      `<div style="position: absolute; left: 50px; top: 50px; width: 600px; height: 600px; transform: scale(0.5); transform-origin: 0 0">
        <div id="probe-popup" style="width: 200px; height: 120px"></div>
      </div>`,
  )
  expectBelow(placed, 2)
})

test("a popup follows a scroll inside a shadow root within a few frames", async ({ page }) => {
  await place(
    page,
    `<div id="probe-scroller" style="height: 300px; width: 300px; overflow: auto; margin: 100px">
      <div style="height: 100px"></div>${anchor("")}<div style="height: 2000px"></div>
    </div>${popup}`,
    true,
  )
  expect(await framesToFollow(page)).toBeLessThanOrEqual(3)
})

test("a popup follows a scroll in the shadow root its anchor is slotted into", async ({ page }) => {
  await place(
    page,
    `<div id="probe-host"><div style="height: 100px"></div>${anchor("")}<div style="height: 2000px"></div></div>${popup}`,
    false,
    `<div id="probe-scroller" style="height: 300px; width: 300px; overflow: auto; margin: 100px"><slot></slot></div>`,
  )
  expect(await framesToFollow(page)).toBeLessThanOrEqual(3)
})

test("a turned popup lines up with its anchor as it would unturned", async ({ page }) => {
  for (const turn of [
    "rotate: 3deg",
    "rotate: x 40deg",
    "transform: rotate(-4deg) scale(0.96)",
    "transform: perspective(600px) rotateX(-20deg); transform-origin: top",
    "transform: perspective(400px) rotateY(15deg)",
  ]) {
    await place(
      page,
      anchor("position: fixed; left: 300px; top: 300px") +
        `<div id="probe-popup" popover="manual" style="width: 200px; height: 120px; padding: 0; border: 0; margin: 0; ${turn}"></div>`,
    )
    const { left, top } = await page
      .locator("#probe-popup")
      .evaluate((el) => ({ left: el.style.left, top: el.style.top }))
    expect(parseFloat(left)).toBeCloseTo(300)
    expect(parseFloat(top)).toBeCloseTo(334)
    await page.evaluate(() => {
      ;(window as unknown as { stopProbe: () => void }).stopProbe()
      document.getElementById("probe-stage")!.remove()
    })
  }
})

test("a popup of a fractional height lines up with its anchor under CSS zoom", async ({ page }) => {
  const placed = await place(
    page,
    `<div style="zoom: 1.5">${anchor("margin: 300px 100px")}<div id="probe-popup" popover="manual" style="width: 200px; height: 17.4px; padding: 0; border: 0; margin: 0"></div></div>`,
  )
  expectBelow(placed, 6)
})

test("a small popup lines up with its anchor under a slight CSS zoom", async ({ page }) => {
  const placed = await place(
    page,
    `<div style="zoom: 1.05">${anchor("margin: 300px 100px")}<div id="probe-popup" popover="manual" style="width: 200px; height: 15px; padding: 0; border: 0; margin: 0"></div></div>`,
  )
  expectBelow(placed, 4.2)
})

test("a popup lines up with an anchor that renders only its text", async ({ page }) => {
  await place(
    page,
    `<div style="position: fixed; left: 300px; top: 300px"><span id="probe-anchor" style="display: contents">Open menu</span></div>${popup}`,
  )
  const text = await page.evaluate(() => {
    const range = document.createRange()
    range.selectNodeContents(document.getElementById("probe-anchor")!)
    const { x, bottom } = range.getBoundingClientRect()
    return { x, bottom }
  })
  const box = (await page.locator("#probe-popup").boundingBox())!
  expect(Math.abs(box.x - text.x)).toBeLessThan(1)
  expect(Math.abs(box.y - (text.bottom + 4))).toBeLessThan(1)
})

test("a popup follows an anchor that renders only its children", async ({ page }) => {
  await place(
    page,
    `<div id="probe-anchor" style="display: contents"><span id="probe-child" style="position: fixed; left: 300px; top: 300px; width: 80px; height: 30px"></span></div>${popup}`,
  )
  const below = async () => {
    const child = (await page.locator("#probe-child").boundingBox())!
    const box = (await page.locator("#probe-popup").boundingBox())!
    return [Math.round(box.x - child.x), Math.round(box.y - (child.y + child.height))]
  }
  expect(await below()).toEqual([0, 4])
  await page.evaluate(() => (document.getElementById("probe-child")!.style.left = "400px"))
  await expect.poll(below).toEqual([0, 4])
  expect((await page.locator("#probe-popup").boundingBox())!.x).toBe(400)
})

test("a popup stays in the part of the page a pinch zoom shows", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Pinch zoom is emulated through the Chrome DevTools Protocol.")
  const cdp = await page.context().newCDPSession(page)
  await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 })
  const viewport = page.viewportSize()!
  await page.mouse.move(viewport.width / 2, viewport.height / 2)
  await page.mouse.wheel(viewport.width, 0)
  await expect.poll(() => page.evaluate(() => visualViewport!.offsetLeft)).toBeGreaterThan(0)
  const visual = await page.evaluate(() => ({
    x: visualViewport!.offsetLeft,
    y: visualViewport!.offsetTop,
    width: visualViewport!.width,
    height: visualViewport!.height,
  }))
  expect(visual.x).toBeGreaterThan(0)
  const { popup: box } = await place(
    page,
    anchor(`position: fixed; left: ${visual.x + visual.width - 100}px; top: ${visual.y + 40}px`) + popup,
  )
  expect(box.x).toBeGreaterThanOrEqual(visual.x)
  expect(box.x + box.width).toBeLessThanOrEqual(visual.x + visual.width)
  await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 1 })
})
