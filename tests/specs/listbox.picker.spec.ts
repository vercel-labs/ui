import AxeBuilder from "@axe-core/playwright"
import type { Locator, Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Listboxes that pick by scrolling, with `bindScrollPicker` and
// `scrollIntoView` off. See fixtures/listbox-picker.ts.

const hours = (page: Page) => page.getByRole("listbox", { name: "Hour" })
const pages = (page: Page) => page.getByRole("listbox", { name: "Page" })
const option = (list: Locator, name: string) =>
  list.getByRole("option", { name, exact: true })
const changes = (page: Page, label: string) =>
  page.getByRole("status", { name: `${label} changes` })

const offsetOf = (el: Locator) =>
  el.evaluate((node) =>
    Number((node as HTMLElement).style.getPropertyValue("--picker-offset"))
  )

// How far the option's center is from the list's, in pixels along its axis.
const distanceFromCenter = (el: Locator) =>
  el.evaluate((node) => {
    const list = node.closest('[role="listbox"]')!
    const box = list.getBoundingClientRect()
    const rect = node.getBoundingClientRect()
    const distance =
      list.getAttribute("aria-orientation") === "horizontal"
        ? rect.left + rect.width / 2 - (box.left + box.width / 2)
        : rect.top + rect.height / 2 - (box.top + box.height / 2)
    return Math.abs(Math.round(distance))
  })

async function center(el: Locator) {
  const box = (await el.boundingBox())!
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

// Moves a pressed mouse along y in 10px steps.
async function dragBy(page: Page, x: number, y: number, by: number) {
  const steps = Math.abs(by) / 10
  for (let step = 1; step <= steps; step++) {
    await page.mouse.move(x, y + (by / steps) * step)
  }
}

// A release reads the pointer's speed over its last 70ms, so waiting that
// long lets go without a flick.
const holdStill = (page: Page) => page.waitForTimeout(100)

async function expectCentered(list: Locator, name: string) {
  const el = option(list, name)
  await expect(el).toHaveAttribute("aria-selected", "true")
  await expect.poll(() => distanceFromCenter(el)).toBe(0)
  await expect.poll(() => offsetOf(el)).toBe(0)
}

test.describe("scrolling", () => {
  test("starts with the selected option at the center", async ({
    page,
    open,
  }) => {
    await open("listbox-picker")
    await expectCentered(hours(page), "3")
    await expectCentered(pages(page), "1")
  })

  test("scrolling settles on the nearest option and selects it", async ({
    page,
    open,
  }) => {
    await open("listbox-picker")
    await hours(page).evaluate((el) => el.scrollBy({ top: 95 }))
    await expectCentered(hours(page), "5")
    await expect(changes(page, "Hour")).toHaveText(/5$/)
  })

  test("settling skips a disabled option", async ({ page, open }) => {
    await open("listbox-picker")
    await hours(page).evaluate((el) => el.scrollBy({ top: 120 }))
    await expectCentered(hours(page), "7")
    await expect(option(hours(page), "6")).toHaveAttribute(
      "aria-selected",
      "false"
    )
  })

  test("the value follows the center while a mouse drag is still held", async ({
    page,
    open,
  }) => {
    await open("listbox-picker")
    await expectCentered(hours(page), "3")
    const { x, y } = await center(hours(page))
    await page.mouse.move(x, y)
    await page.mouse.down()
    await dragBy(page, x, y, -80)
    await expect(option(hours(page), "5")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await holdStill(page)
    await page.mouse.up()
    await expectCentered(hours(page), "5")
  })

  test("a flick with the mouse coasts past where it let go", async ({
    page,
    open,
  }) => {
    await open("listbox-picker")
    await expectCentered(hours(page), "3")
    const { x, y } = await center(hours(page))
    await page.mouse.move(x, y)
    await page.mouse.down()
    await dragBy(page, x, y, -80)
    await page.mouse.up()
    await expect
      .poll(async () =>
        Number(
          await hours(page)
            .getByRole("option", { selected: true })
            .textContent()
        )
      )
      .toBeGreaterThan(6)
  })

  test("a mouse drag doesn't press the option it started on", async ({
    page,
    open,
  }) => {
    await open("listbox-picker")
    await expectCentered(hours(page), "3")
    const { x, y } = await center(option(hours(page), "5"))
    await page.mouse.move(x, y)
    await page.mouse.down()
    await dragBy(page, x, y, -40)
    await holdStill(page)
    await page.mouse.up()
    await expectCentered(hours(page), "4")
    await expect(changes(page, "Hour")).toHaveText("4")
  })
})

test.describe("pressing and keys", () => {
  test("clicking an option centers and selects it", async ({ page, open }) => {
    await open("listbox-picker")
    await option(hours(page), "5").click()
    await expectCentered(hours(page), "5")
    await expect(changes(page, "Hour")).toHaveText("5")
  })

  test("an arrow key moves one option, and the scroll there selects nothing on the way", async ({
    page,
    open,
  }) => {
    await open("listbox-picker")
    await option(hours(page), "3").focus()
    await page.keyboard.press("ArrowDown")
    await expectCentered(hours(page), "4")
    await page.keyboard.press("End")
    await expectCentered(hours(page), "12")
    await page.keyboard.press("Home")
    await expectCentered(hours(page), "1")
    await expect(changes(page, "Hour")).toHaveText("4,12,1")
  })

  test("arrow keys skip a disabled option", async ({ page, open }) => {
    await open("listbox-picker")
    await option(hours(page), "5").click()
    await expectCentered(hours(page), "5")
    await page.keyboard.press("ArrowDown")
    await expectCentered(hours(page), "7")
  })

  test("Page Down moves a page of options and selects only where it lands", async ({
    page,
    open,
  }) => {
    await open("listbox-picker")
    await option(hours(page), "3").focus()
    await page.keyboard.press("PageDown")
    await expectCentered(hours(page), "7")
    await expect(option(hours(page), "7")).toBeFocused()
    await page.keyboard.press("PageUp")
    await expectCentered(hours(page), "3")
    await expect(changes(page, "Hour")).toHaveText("7,3")
  })

  test("with reduced motion, a move jumps instead of scrolling smoothly", async ({
    page,
    open,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await open("listbox-picker")
    await hours(page).evaluate((el) => {
      const seen: number[] = []
      el.addEventListener("scroll", () => seen.push(el.scrollTop))
      Object.assign(window, { seen })
    })
    await option(hours(page), "3").focus()
    await page.keyboard.press("End")
    await expectCentered(hours(page), "12")
    const seen = await page.evaluate(
      () => (window as unknown as { seen: number[] }).seen
    )
    expect(new Set(seen).size).toBe(1)
  })
})

test.describe("--picker-offset", () => {
  test("is 0 on the centered option and counts options from it", async ({
    page,
    open,
  }) => {
    await open("listbox-picker")
    await expectCentered(hours(page), "3")
    expect(await offsetOf(option(hours(page), "4"))).toBe(1)
    expect(await offsetOf(option(hours(page), "1"))).toBe(-2)
  })

  test("is fractional while a drag holds the list between options", async ({
    page,
    open,
  }) => {
    await open("listbox-picker")
    await expectCentered(hours(page), "3")
    const { x, y } = await center(hours(page))
    await page.mouse.move(x, y)
    await page.mouse.down()
    await dragBy(page, x, y, -20)
    await expect.poll(() => offsetOf(option(hours(page), "3"))).toBe(-0.5)
    await expect.poll(() => offsetOf(option(hours(page), "4"))).toBe(0.5)
    await page.mouse.up()
  })
})

test.describe("horizontal", () => {
  test("options of different widths center when clicked", async ({
    page,
    open,
  }) => {
    await open("listbox-picker")
    await option(pages(page), "12").click()
    await expectCentered(pages(page), "12")
    await option(pages(page), "9").click()
    await expectCentered(pages(page), "9")
    await expect(changes(page, "Page")).toHaveText("12,9")
  })

  test("Right moves to the next page", async ({ page, open }) => {
    await open("listbox-picker")
    await option(pages(page), "1").focus()
    await page.keyboard.press("ArrowRight")
    await expectCentered(pages(page), "2")
    expect(await offsetOf(option(pages(page), "1"))).toBe(-1)
  })

  test("in right-to-left text, the strip runs from the right and Left moves to the next page", async ({
    page,
    open,
  }) => {
    await open("listbox-picker", { dir: "rtl" })
    await expectCentered(pages(page), "1")
    const one = (await option(pages(page), "1").boundingBox())!
    const two = (await option(pages(page), "2").boundingBox())!
    expect(two.x).toBeLessThan(one.x)
    await option(pages(page), "1").focus()
    await page.keyboard.press("ArrowLeft")
    await expectCentered(pages(page), "2")
    expect(await offsetOf(option(pages(page), "1"))).toBe(-1)
  })

  test("in right-to-left text, scrolling toward the end selects later pages", async ({
    page,
    open,
  }) => {
    await open("listbox-picker", { dir: "rtl" })
    await expectCentered(pages(page), "1")
    const width = await option(pages(page), "1").evaluate(
      (el) => (el as HTMLElement).offsetWidth
    )
    await pages(page).evaluate((el, by) => el.scrollBy({ left: -by }), width)
    await expectCentered(pages(page), "2")
  })
})

test("no axe violations", async ({ page, open }) => {
  await open("listbox-picker")
  await expect(hours(page)).toBeVisible()
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  expect(results.violations.map((violation) => violation.id)).toEqual([])
})
