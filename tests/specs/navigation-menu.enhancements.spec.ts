import type { Locator, Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

const trigger = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true })
const link = (page: Page, name: string) =>
  page.getByRole("link", { name, exact: true })

async function pointAt(page: Page, target: Locator) {
  const box = (await target.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
    steps: 4,
  })
}

// Whether the indicator covers an element's width, along its bottom edge.
async function indicatorUnder(page: Page, target: Locator) {
  const indicator = await page.locator(".nav-indicator").boundingBox()
  const box = await target.boundingBox()
  if (!indicator || !box) {
    return false
  }
  return (
    Math.abs(indicator.x - box.x) <= 1 &&
    Math.abs(indicator.width - box.width) <= 1
  )
}

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("navigation-menu")
  })

  test.describe("keyboard", () => {
    test("ArrowDown on a trigger opens its panel and moves focus to its first link", async ({
      page,
    }) => {
      await trigger(page, "Products").focus()
      await page.keyboard.press("ArrowDown")
      await expect(link(page, "Analytics")).toBeFocused()
    })

    test("ArrowDown on an open trigger moves into its panel", async ({
      page,
    }) => {
      await trigger(page, "Products").focus()
      await page.keyboard.press("Enter")
      await expect(link(page, "Analytics")).toBeVisible()
      await page.keyboard.press("ArrowDown")
      await expect(link(page, "Analytics")).toBeFocused()
    })

    test("Home and End move to the first and last top-level items", async ({
      page,
    }) => {
      await trigger(page, "Resources").focus()
      await page.keyboard.press("End")
      await expect(link(page, "Pricing")).toBeFocused()
      await page.keyboard.press("Home")
      await expect(trigger(page, "Products")).toBeFocused()
    })

    test("the same keys pressed without waiting still land", async ({
      page,
    }) => {
      await trigger(page, "Products").focus()
      await page.keyboard.press("ArrowDown")
      await page.keyboard.press("ArrowDown")
      await page.keyboard.press("ArrowDown")
      await expect(link(page, "Security")).toBeFocused()
    })
  })

  test.describe("pointer", () => {
    test("with hover opening off, resting the pointer opens nothing and a click still does", async ({
      page,
      open,
    }) => {
      await open("navigation-menu", { hover: "false" })
      await trigger(page, "Products").hover()
      await page.waitForTimeout(300)
      await expect(link(page, "Analytics")).toBeHidden()
      await trigger(page, "Products").click()
      await expect(link(page, "Analytics")).toBeVisible()
    })

    test("a click long after the pointer opened a panel still keeps it open", async ({
      page,
    }) => {
      await trigger(page, "Products").hover()
      await expect(link(page, "Analytics")).toBeVisible()
      await page.waitForTimeout(800)
      await trigger(page, "Products").click()
      await page.waitForTimeout(200)
      await expect(link(page, "Analytics")).toBeVisible()
    })

    test("an outside press reports itself, not a focus change", async ({
      page,
      open,
    }) => {
      await open("navigation-menu", { delay: "2000" })
      await trigger(page, "Products").click()
      await expect(link(page, "Analytics")).toBeVisible()
      await page.mouse.click(5, 300)
      await expect(link(page, "Analytics")).toBeHidden()
      expect(await lastAction(page)).toBe("close: outside-press")
    })

    test("the panel stays open while focus is in it, even when the pointer leaves", async ({
      page,
    }) => {
      await trigger(page, "Products").hover()
      await expect(link(page, "Analytics")).toBeVisible()
      await pointAt(page, link(page, "Analytics"))
      await link(page, "Analytics").focus()
      await page.mouse.move(5, 300, { steps: 4 })
      await page.waitForTimeout(400)
      await expect(link(page, "Analytics")).toBeVisible()
    })
  })

  test.describe("links", () => {
    test("a link pressed with a modifier key, which opens a new tab, leaves the menu open", async ({
      page,
      context,
    }) => {
      await trigger(page, "Products").click()
      const opened = context.waitForEvent("page")
      await link(page, "Engagement").click({ modifiers: ["ControlOrMeta"] })
      await (await opened).close()
      await expect(link(page, "Engagement")).toBeVisible()
    })
  })

  test.describe("without a viewport", () => {
    test.beforeEach(async ({ open }) => {
      await open("navigation-menu", { viewport: "none" })
    })

    test("each panel opens as its own popup below its trigger", async ({
      page,
    }) => {
      await trigger(page, "Resources").hover()
      await expect(link(page, "Blog")).toBeVisible()
      const panel = (await page
        .locator(".nav-content", { has: link(page, "Blog") })
        .boundingBox())!
      const anchor = (await trigger(page, "Resources").boundingBox())!
      expect(panel.y).toBeGreaterThanOrEqual(anchor.y + anchor.height - 1)
      expect(Math.abs(panel.x - anchor.x)).toBeLessThanOrEqual(1)
    })

    test("panels switch, close on Escape and return focus like with one", async ({
      page,
      tab,
    }) => {
      await trigger(page, "Products").focus()
      await page.keyboard.press("Enter")
      await tab()
      await expect(link(page, "Analytics")).toBeFocused()
      await page.keyboard.press("Escape")
      await expect(link(page, "Analytics")).toBeHidden()
      await expect(trigger(page, "Products")).toBeFocused()
    })
  })

  test.describe("motion", () => {
    // The fixture turns its transitions off for reduced motion, which a machine's setting can ask for.
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" })
    })

    test("content coming from a later item enters from the end, and the one it replaced leaves toward the start", async ({
      page,
      open,
    }) => {
      await open("navigation-menu", { animate: "" })
      await trigger(page, "Products").hover()
      await expect(link(page, "Analytics")).toBeVisible()
      // A content leaving before it finished coming in reverses its entrance, which is shorter.
      await page.waitForFunction(() => document.getAnimations().length === 0)
      await pointAt(page, trigger(page, "Resources"))
      await expect(
        page.locator(".nav-content", { has: link(page, "Blog") })
      ).toHaveAttribute("data-motion", "from-end")
      await expect(
        page.locator('.nav-content[data-motion="to-start"]')
      ).toHaveCount(1)
    })

    test("content coming from an earlier item enters from the start", async ({
      page,
    }) => {
      await trigger(page, "Resources").hover()
      await expect(link(page, "Blog")).toBeVisible()
      await pointAt(page, trigger(page, "Products"))
      await expect(
        page.locator(".nav-content", { has: link(page, "Analytics") })
      ).toHaveAttribute("data-motion", "from-start")
    })
  })

  test.describe("indicator", () => {
    test("the indicator rests on the current page's link while closed", async ({
      page,
    }) => {
      await expect
        .poll(() => indicatorUnder(page, link(page, "Pricing")))
        .toBe(true)
    })

    test("the indicator moves under the open trigger", async ({ page }) => {
      await trigger(page, "Resources").hover()
      await expect(link(page, "Blog")).toBeVisible()
      await expect
        .poll(() => indicatorUnder(page, trigger(page, "Resources")))
        .toBe(true)
    })

    test("the indicator follows an item added later as it grows", async ({
      page,
      framework,
    }) => {
      test.skip(!framework.startsWith("web"), "Adds an item through the DOM.")
      await expect
        .poll(() => indicatorUnder(page, link(page, "Pricing")))
        .toBe(true)
      await page.evaluate(() => {
        const item = document.createElement("ui-navigation-menu-item")
        item.innerHTML = `<ui-navigation-menu-link><a class="nav-link" id="late" href="#late">Late</a></ui-navigation-menu-link>`
        document.querySelector("ui-navigation-menu-list")!.prepend(item)
      })
      await expect
        .poll(() => indicatorUnder(page, link(page, "Pricing")))
        .toBe(true)
      await page
        .locator("#late")
        .evaluate((el) => (el.style.paddingInline = "60px"))
      await expect
        .poll(() => indicatorUnder(page, link(page, "Pricing")))
        .toBe(true)
    })
  })

  test.describe("find in page", () => {
    test("find in page opens the item whose closed panel matched", async ({
      page,
      open,
    }) => {
      await open("navigation-menu", { "hidden-until-found": "" })
      const panel = page.locator(".nav-content", {
        has: page.locator('a[href="#engagement"]'),
      })
      await expect(panel).toHaveAttribute("hidden", "until-found")
      await panel.evaluate((el) =>
        el.dispatchEvent(new Event("beforematch", { bubbles: true }))
      )
      await expect(link(page, "Engagement")).toBeVisible()
      expect(await lastAction(page)).toBe("products: find-in-page")
    })
  })

  test.describe("nested", () => {
    test("a nested menu adds no second navigation landmark", async ({
      page,
      open,
    }) => {
      await open("navigation-menu", { nested: "", delay: "2000" })
      await trigger(page, "Resources").click()
      await trigger(page, "Learn").click()
      await expect(link(page, "Tutorials")).toBeVisible()
      await expect(page.getByRole("navigation")).toHaveCount(1)
    })

    test("Escape closes only the nested panel, then the outer one", async ({
      page,
      open,
      tab,
    }) => {
      await open("navigation-menu", { nested: "", delay: "2000" })
      await trigger(page, "Resources").click()
      await trigger(page, "Learn").click()
      await expect(link(page, "Tutorials")).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(link(page, "Tutorials")).toBeHidden()
      await expect(link(page, "Blog")).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(link(page, "Blog")).toBeHidden()
    })
  })
})
