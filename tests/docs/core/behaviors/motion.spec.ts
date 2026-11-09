import { expect, type Locator } from "@playwright/test"
import { test } from "../../docs-test"
import { openBehaviors } from "./helpers"

// The newest line in an example's console.
const lastLog = (example: Locator) =>
  example
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openBehaviors(page, "motion")
  await expect(page.locator("[data-example]")).toHaveCount(7)
  expect(errors).toEqual([])
})

test("panel: a question opens its answer with a height animation, and closes again", async ({
  page,
}) => {
  await openBehaviors(page, "motion")
  const trigger = page.getByRole("button", { name: "Can I get a refund?" })
  await trigger.scrollIntoViewIfNeeded()
  const answer = page
    .locator('[data-example="behaviors/panel"]')
    .getByText("within 30 days")
  await expect(answer).toHaveCount(0)
  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(answer).toBeVisible()
  const region = page.getByRole("region").filter({ hasText: "within 30 days" })
  await expect
    .poll(() =>
      region.evaluate((el) => el.style.getPropertyValue("--panel-height"))
    )
    .toBe("auto")
  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(region).toHaveAttribute("data-ending-style", "")
  await expect(answer).toHaveCount(0)
})

test("gestures: a throw lands past where the pointer let go, and keys step", async ({
  page,
}) => {
  await openBehaviors(page, "motion")
  const thumb = page.getByRole("slider", { name: "Fan speed" })
  await thumb.scrollIntoViewIfNeeded()
  const box = (await thumb.boundingBox())!
  const y = box.y + box.height / 2
  // A slow drag a little way lands on the next speed.
  await page.mouse.move(box.x + box.width / 2, y)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 60, y, { steps: 20 })
  await page.waitForTimeout(150)
  await page.mouse.up()
  await expect(thumb).toHaveAttribute("aria-valuetext", "Low")
  await expect(thumb).not.toHaveAttribute("data-dragging")
  // A quick flick the same distance coasts on to the end.
  const at = (await thumb.boundingBox())!
  await page.mouse.move(at.x + at.width / 2, y)
  await page.mouse.down()
  await page.mouse.move(at.x + at.width / 2 + 20, y, { steps: 2 })
  await page.mouse.move(at.x + at.width / 2 + 60, y, { steps: 2 })
  await page.mouse.up()
  await expect(thumb).toHaveAttribute("aria-valuetext", "High")
  await thumb.focus()
  await page.keyboard.press("ArrowLeft")
  await expect(thumb).toHaveAttribute("aria-valuetext", "Medium")
  await page.keyboard.press("Home")
  await expect(thumb).toHaveAttribute("aria-valuetext", "Off")
})

test("findable panels: the first opens with the page, find in page opens one, and Open all opens the rest at once", async ({
  page,
}) => {
  await openBehaviors(page, "motion")
  const trigger = (version: string) =>
    page.getByRole("button", { name: `Version ${version}` })
  const panel = (text: string) =>
    page.getByRole("region", { includeHidden: true }).filter({ hasText: text })
  await trigger("3.0").scrollIntoViewIfNeeded()
  await expect(trigger("3.0")).toHaveAttribute("aria-expanded", "true")
  await expect(panel("Dark mode")).toBeVisible()
  // Closed sections stay in the page, findable.
  await expect(panel("offline")).toHaveAttribute("hidden", "until-found")
  await panel("offline").evaluate((el) =>
    el.dispatchEvent(new Event("beforematch"))
  )
  await expect(trigger("2.4")).toHaveAttribute("aria-expanded", "true")
  await expect(lastLog(trigger("2.4"))).toHaveText("Version 2.4 opened")
  await trigger("2.4").click()
  await expect(panel("offline")).toHaveAttribute("data-ending-style", "")
  await expect(lastLog(trigger("2.4"))).toHaveText("Version 2.4 closed")
  await expect(panel("offline")).toHaveAttribute("hidden", "until-found")
  await page.locator('[data-slot="notes-expand"]').click()
  await expect(trigger("2.3")).toHaveAttribute("aria-expanded", "true")
  await expect(panel("PDF")).not.toHaveAttribute("data-starting-style")
  await expect(panel("PDF")).toBeVisible()
})

test("findable: hidden text stays findable, and a match shows it", async ({
  page,
}) => {
  await openBehaviors(page, "motion")
  const toggle = page.locator('[data-slot="recipe-toggle"]')
  const method = page.locator('[data-slot="recipe-method"]')
  await toggle.scrollIntoViewIfNeeded()
  await expect(page.locator("[data-findable]")).toHaveText(
    "Find in page can show the method."
  )
  await expect(method).toHaveAttribute("hidden", "until-found")
  await method.evaluate((el) => el.dispatchEvent(new Event("beforematch")))
  await expect(toggle).toHaveText("Hide Method")
  await expect(method).toBeVisible()
  await toggle.click()
  await expect(method).toHaveAttribute("hidden", "until-found")
})

test("presence: a toast slides in, and leaves once it has faded out", async ({
  page,
}) => {
  await openBehaviors(page, "motion")
  const save = page.locator('[data-slot="toasts-add"]')
  await save.scrollIntoViewIfNeeded()
  await save.click()
  await save.click()
  const toasts = page.locator('[data-slot="toasts-toast"]')
  await expect(toasts).toHaveCount(2)
  await expect(toasts.first()).not.toHaveAttribute("data-starting-style")
  await toasts.first().locator('[data-slot="toasts-dismiss"]').click()
  await expect(toasts.first()).toHaveAttribute("data-ending-style", "")
  await expect(toasts).toHaveCount(1)
})

test("rubber band: a pull stretches less past the top, refreshes past the line and springs back", async ({
  page,
}) => {
  await openBehaviors(page, "motion")
  const list = page.getByRole("list", { name: "Inbox" })
  await list.scrollIntoViewIfNeeded()
  const box = (await list.boundingBox())!
  const x = box.x + box.width / 2
  const pulled = () =>
    list.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42)
  // A pull of 150 pixels shows as less.
  await page.mouse.move(x, box.y + 20)
  await page.mouse.down()
  await page.mouse.move(x, box.y + 170, { steps: 15 })
  const shown = await pulled()
  expect(shown).toBeGreaterThan(48)
  expect(shown).toBeLessThan(150)
  await page.waitForTimeout(100)
  await page.mouse.up()
  await expect(lastLog(list)).toHaveText("Let go at 0.00 px/ms")
  await expect(list).toHaveAttribute("aria-busy", "true")
  await expect(lastLog(list)).toHaveText("Refreshed 1 time")
  await expect.poll(pulled).toBe(0)
  // A short pull held still springs back without refreshing.
  await page.mouse.move(x, box.y + 20)
  await page.mouse.down()
  await page.mouse.move(x, box.y + 50, { steps: 5 })
  await page.waitForTimeout(100)
  await page.mouse.up()
  await expect.poll(pulled).toBe(0)
  await expect(lastLog(list)).toHaveText("Let go at 0.00 px/ms")
  await page.locator('[data-slot="inbox-refresh"]').click()
  await expect(lastLog(list)).toHaveText("Refreshed 2 times")
})

test("sector: a stroke picks the reaction it points at, and a short one picks nothing", async ({
  page,
}) => {
  await openBehaviors(page, "motion")
  const handle = page.locator('[data-slot="react-handle"]')
  await handle.scrollIntoViewIfNeeded()
  const box = (await handle.boundingBox())!
  const cx = box.x + box.width / 2
  const cy = box.y + box.height / 2
  // Straight right is the second wedge's.
  await page.mouse.move(cx, cy)
  await page.mouse.down()
  await page.mouse.move(cx + 40, cy, { steps: 5 })
  await expect(page.getByRole("button", { name: "Celebrate" })).toHaveAttribute(
    "data-pointing",
    ""
  )
  await page.mouse.up()
  await expect(page.getByRole("button", { name: "Celebrate" })).toHaveAttribute(
    "aria-pressed",
    "true"
  )
  // Within the dead zone, nothing.
  await page.mouse.move(cx, cy)
  await page.mouse.down()
  await page.mouse.move(cx - 10, cy - 10, { steps: 3 })
  await page.mouse.up()
  await expect(page.getByRole("button", { name: "Celebrate" })).toHaveAttribute(
    "aria-pressed",
    "true"
  )
  await page.getByRole("button", { name: "Love" }).click()
  await expect(page.getByRole("button", { name: "Love" })).toHaveAttribute(
    "aria-pressed",
    "true"
  )
})

test("each option links to the example that shows it", async ({ page }) => {
  await openBehaviors(page, "motion")
  for (const label of ["PanelBinding", "VelocityTrackerOptions"]) {
    const table = page.getByLabel(label, { exact: true })
    const fields = table.locator("dt")
    const links = table.getByRole("link")
    await expect(fields).not.toHaveCount(0)
    await expect(links).toHaveCount(await fields.count())
    for (const link of await links.all()) {
      const href = (await link.getAttribute("href"))!
      if (!href.startsWith("#")) {
        continue
      }
      await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1)
    }
  }
})
