import { expect, test } from "@playwright/test"
import { openBehaviors } from "./helpers"

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openBehaviors(page, "canvas")
  await expect(page.locator("[data-example]")).toHaveCount(6)
  expect(errors).toEqual([])
})

test("viewport: a drag on the empty board pans, + zooms, and reset goes back", async ({ page }) => {
  await openBehaviors(page, "canvas")
  const board = page.getByLabel("Board", { exact: true })
  await board.scrollIntoViewIfNeeded()
  const world = board.locator('[data-slot="board-world"]')
  const box = (await board.boundingBox())!
  await page.mouse.move(box.x + box.width - 20, box.y + 16)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width - 60, box.y + 36, { steps: 8 })
  await page.mouse.up()
  await expect(world).toHaveAttribute("style", /translate\(-40px, ?20px\) scale\(1\)/)
  await board.focus()
  await page.keyboard.press("0")
  await page.keyboard.press("+")
  await expect(world).toHaveAttribute("style", /scale\(1\.25\)/)
  await board.getByRole("button", { name: "Reset view" }).click()
  await expect(world).toHaveAttribute("style", /translate\(0px, ?0px\) scale\(1\)/)
})

test("connect: a drag from an output to an input connects them, and so does the keyboard", async ({
  page,
}) => {
  await openBehaviors(page, "canvas")
  const prompt = page.getByRole("button", { name: "Prompt" })
  await prompt.scrollIntoViewIfNeeded()
  const out = prompt.locator('[data-side="right"]')
  const input = page.getByRole("button", { name: "Answer" }).locator('[data-side="left"]')
  const from = (await out.boundingBox())!
  const to = (await input.boundingBox())!
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x + to.width / 2 + 10, to.y + to.height / 2 + 6, { steps: 10 })
  await expect(input).toHaveAttribute("data-connect", "target")
  await page.mouse.up()
  const edges = page.locator('[data-slot="flow-edge"]')
  await expect(edges).toHaveCount(1)
  await expect(prompt).toHaveAttribute("aria-description", "Connected to Answer.")

  await prompt.focus()
  await page.keyboard.press("c")
  await page.keyboard.press("ArrowRight")
  await expect(page.getByRole("button", { name: "Summary" }).locator('[data-side="left"]')).toHaveAttribute(
    "data-connect",
    "target",
  )
  await page.keyboard.press("Enter")
  await expect(edges).toHaveCount(2)
  await expect(prompt).toHaveAttribute("aria-description", "Connected to Answer, Summary.")
})

test("viewport fit: Fit shows every sight, zoom stays in bounds, the arrows pan, and focus reveals", async ({
  page,
}) => {
  await openBehaviors(page, "canvas")
  const frame = page.getByLabel("Sights", { exact: true })
  await frame.scrollIntoViewIfNeeded()
  const world = frame.locator('[data-slot="map-world"]')
  const zoom = page.locator('[data-slot="map-zoom"]')
  const action = (name: string) => page.locator('[data-slot="map-action"]', { hasText: name })
  await expect(zoom).toHaveAttribute("data-zoom", "100%")
  await action("Fit").click()
  const zoomed = Number((await zoom.getAttribute("data-zoom"))!.replace("%", ""))
  expect(zoomed).toBeLessThan(100)
  expect(zoomed).toBeGreaterThanOrEqual(25)
  const box = (await frame.boundingBox())!
  for (const sight of await frame.locator('[data-slot="map-sight"]').all()) {
    const at = (await sight.boundingBox())!
    expect(at.x).toBeGreaterThanOrEqual(box.x)
    expect(at.x + at.width).toBeLessThanOrEqual(box.x + box.width + 1)
  }
  for (let i = 0; i < 6; i++) await page.getByRole("button", { name: "Zoom out" }).click()
  await expect(zoom).toHaveAttribute("data-zoom", "25%")
  await action("100%").click()
  await expect(zoom).toHaveAttribute("data-zoom", "100%")
  await expect(world).toHaveAttribute("style", /scale\(1\)/)
  const before = await world.getAttribute("style")
  await page.getByRole("button", { name: "Pan right" }).click()
  await expect(world).not.toHaveAttribute("style", before!)
  // Harbor sits far off to the bottom right; focusing it brings it in.
  await page.getByRole("button", { name: "📍 Museum" }).focus()
  const harbor = page.getByRole("button", { name: "📍 Harbor" })
  await harbor.focus()
  const frameBox = (await frame.boundingBox())!
  const harborBox = (await harbor.boundingBox())!
  expect(harborBox.y + harborBox.height).toBeLessThanOrEqual(frameBox.y + frameBox.height)
  expect(harborBox.x + harborBox.width).toBeLessThanOrEqual(frameBox.x + frameBox.width)
  await frame.focus()
  await page.keyboard.press("+")
  await expect(page.locator("[data-ui-sdk-announcer]").filter({ hasText: "Map at 125 percent" })).toHaveCount(
    1,
  )
})

test("viewport points: a double-click drops a dot under the pointer at any zoom, and the page keeps the viewport", async ({
  page,
}) => {
  await openBehaviors(page, "canvas")
  const frame = page.getByLabel("Dots", { exact: true })
  await frame.scrollIntoViewIfNeeded()
  const label = page.locator('[data-slot="dots-label"]')
  const box = (await frame.boundingBox())!
  await page.mouse.dblclick(Math.round(box.x) + 40, Math.round(box.y) + 50)
  await expect(label).toHaveAttribute("data-at", "40, 50")
  await frame.focus()
  await page.keyboard.press("+")
  await expect(page.locator("[data-reason]")).toHaveText("Moved by zoom-key, zoom 125%")
  // Zoomed at the center, the canvas point under (40, 50) moved; the dot dropped there is where the pointer is.
  await page.mouse.dblclick(box.x + 200, box.y + 100)
  const at = await label.getAttribute("data-at")
  const [x, y] = at!.split(", ").map(Number)
  const center = { x: box.width / 2, y: box.height / 2 }
  expect(x).toBeCloseTo(center.x + (200 - center.x) / 1.25, -0.5)
  expect(y).toBeCloseTo(center.y + (100 - center.y) / 1.25, -0.5)
  // The label sits at the newest dot on screen, whatever the zoom.
  const labelBox = (await label.boundingBox())!
  expect(labelBox.x - box.x).toBeGreaterThan(200)
  expect(Math.abs(labelBox.y + labelBox.height / 2 - (box.y + 100))).toBeLessThan(3)
  await expect(page.locator('[data-slot="dots-view"]')).toHaveAttribute("data-view", /^\d+, \d+ to \d+, \d+$/)
  const from = { x: box.x + box.width - 20, y: box.y + 20 }
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(from.x - 30, from.y, { steps: 5 })
  await page.mouse.up()
  await expect(page.locator("[data-reason]")).toHaveText("Moved by drag, zoom 125%")
})

test("connect patch: a cable snaps from afar, a second patch unplugs, and code patches and cancels", async ({
  page,
}) => {
  await openBehaviors(page, "canvas")
  const jack = (port: string) =>
    page.locator('[data-slot="bay-jack"]').nth(["mic", "guitar", "synth", "ch1", "ch2", "ch3"].indexOf(port))
  const cables = page.locator('[data-slot="bay-cable"]')
  await jack("mic").scrollIntoViewIfNeeded()
  const drag = async (from: string, to: string) => {
    const a = (await jack(from).boundingBox())!
    const b = (await jack(to).boundingBox())!
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2)
    await page.mouse.down()
    // 40 pixels short: inside the 48 pixel radius.
    await page.mouse.move(b.x + b.width / 2 - 40, b.y + b.height / 2, { steps: 10 })
    await expect(jack(to)).toHaveAttribute("data-connect", "target")
    await page.mouse.up()
  }
  await drag("mic", "ch2")
  await expect(cables).toHaveCount(1)
  await expect(page.getByRole("button", { name: "Mic" })).toHaveAttribute(
    "aria-description",
    "Into Channel 2.",
  )
  await expect(page.locator("[data-ui-sdk-announcer='assertive']")).toHaveText("Mic into Channel 2.")
  await drag("mic", "ch2")
  await expect(cables).toHaveCount(0)
  await page.locator('[data-slot="bay-action"]', { hasText: "Synth into 3" }).click()
  await expect(cables).toHaveCount(1)
  await expect(page.getByRole("button", { name: "Synth", exact: true })).toHaveAttribute(
    "aria-description",
    "Into Channel 3.",
  )
  // From the keyboard, then Cancel lets go.
  await page.getByRole("button", { name: "Guitar" }).focus()
  await page.keyboard.press("Enter")
  await expect(jack("guitar")).toHaveAttribute("data-connect", "source")
  await page.locator('[data-slot="bay-action"]', { hasText: "Cancel" }).click()
  await expect(jack("guitar")).not.toHaveAttribute("data-connect")
  await expect(page.locator('[data-slot="bay-draft"]')).toHaveAttribute("d", "")
})

test("every option links to the example that shows it", async ({ page }) => {
  await openBehaviors(page, "canvas")
  for (const label of ["ViewportOptions", "ConnectOptions"]) {
    const table = page.getByLabel(label, { exact: true })
    const fields = table.locator("dt")
    const links = table.getByRole("link")
    await expect(fields).not.toHaveCount(0)
    await expect(links).toHaveCount(await fields.count())
    for (const link of await links.all()) {
      const href = (await link.getAttribute("href"))!
      if (!href.startsWith("#")) continue
      await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1)
    }
  }
})
