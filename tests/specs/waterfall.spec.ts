import { expect, lastAction, test } from "../fixtures"
import { bar, cell, row, variable } from "./waterfall.helpers"

// Behavior follows the WAI-ARIA treegrid pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/

test.describe("rows", () => {
  test.beforeEach(async ({ open }) => {
    await open("waterfall")
  })

  test("spans start collapsed, and only top-level rows show", async ({
    page,
  }) => {
    await expect(page.getByRole("treegrid", { name: "Requests" })).toBeVisible()
    await expect(row(page, "GET /")).toHaveAttribute("aria-expanded", "false")
    await expect(row(page, "GET /font.woff2")).not.toHaveAttribute(
      "aria-expanded"
    )
    await expect(row(page, "GET /")).toHaveAttribute("aria-level", "1")
    await expect(row(page, "GET /")).toHaveAttribute("aria-posinset", "1")
    await expect(row(page, "GET /")).toHaveAttribute("aria-setsize", "2")
    await expect(
      page.locator('[data-slot="waterfall-row"]:visible')
    ).toHaveCount(2)
  })

  test("clicking the indicator expands a span without selecting it", async ({
    page,
  }) => {
    await row(page, "GET /")
      .locator('[data-slot="waterfall-indicator"]')
      .click()
    await expect(row(page, "GET /")).toHaveAttribute("aria-expanded", "true")
    await expect(row(page, "GET /")).toHaveAttribute("aria-selected", "false")
    await expect(row(page, "GET /app.js")).toHaveAttribute("aria-level", "2")
    await expect(row(page, "GET /app.js")).toHaveAttribute("aria-posinset", "2")
    expect(await lastAction(page)).toBe("expanded document")
  })

  test("clicking a row's cell selects the row and focuses the cell", async ({
    page,
  }) => {
    await bar(page, "GET /font.woff2").click()
    await expect(bar(page, "GET /font.woff2")).toBeFocused()
    await expect(row(page, "GET /font.woff2")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await expect(row(page, "GET /")).toHaveAttribute("aria-selected", "false")
    expect(await lastAction(page)).toBe("selected font")
  })

  test("a change can be canceled", async ({ page, open }) => {
    await open("waterfall", { cancel: "document" })
    await row(page, "GET /")
      .locator('[data-slot="waterfall-indicator"]')
      .click()
    await expect(row(page, "GET /")).toHaveAttribute("aria-expanded", "false")
  })

  test("a controller expands and collapses everything, and reveals a span", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Expand all" }).click()
    await expect(row(page, "GET /api/flags")).toBeVisible()
    await page.getByRole("button", { name: "Collapse all" }).click()
    await expect(row(page, "GET /app.js")).toHaveCount(0)
    await page.getByRole("button", { name: "Reveal flags" }).click()
    await expect(row(page, "GET /api/flags")).toBeFocused()
  })

  test("collapsing a span from its indicator moves focus out of it", async ({
    page,
    open,
  }) => {
    await open("waterfall", { expanded: "document,script" })
    await bar(page, "GET /api/user").click()
    await expect(bar(page, "GET /api/user")).toBeFocused()
    await row(page, "GET /")
      .locator('[data-slot="waterfall-indicator"]')
      .click()
    await expect(row(page, "GET /")).toBeFocused()
  })
})

test.describe("keyboard", () => {
  test.beforeEach(async ({ open }) => {
    await open("waterfall", { expanded: "document" })
  })

  test("the waterfall is one tab stop", async ({ page, tab }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(row(page, "GET /")).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })

  test("Down and Up move between rows, Home and End to the first and last", async ({
    page,
  }) => {
    await row(page, "GET /").focus()
    await page.keyboard.press("ArrowDown")
    await expect(row(page, "GET /app.css")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(row(page, "GET /app.js")).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(row(page, "GET /app.css")).toBeFocused()
    await page.keyboard.press("End")
    await expect(row(page, "GET /font.woff2")).toBeFocused()
    await page.keyboard.press("Home")
    await expect(row(page, "GET /")).toBeFocused()
    await page.keyboard.press("PageDown")
    await expect(row(page, "GET /font.woff2")).toBeFocused()
    await page.keyboard.press("PageUp")
    await expect(row(page, "GET /")).toBeFocused()
  })

  test("Right expands a collapsed row, then moves into its cells", async ({
    page,
  }) => {
    await row(page, "GET /app.js").focus()
    await page.keyboard.press("ArrowRight")
    await expect(row(page, "GET /app.js")).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await expect(row(page, "GET /app.js")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(cell(page, "GET /app.js", 0)).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(cell(page, "GET /app.js", 1)).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(bar(page, "GET /app.js")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(bar(page, "GET /app.js")).toBeFocused()
  })

  test("Left moves back through the cells to the row, collapses it, then moves to the parent", async ({
    page,
  }) => {
    await row(page, "GET /app.css").focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await expect(cell(page, "GET /app.css", 1)).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await page.keyboard.press("ArrowLeft")
    await expect(row(page, "GET /app.css")).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await expect(row(page, "GET /")).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await expect(row(page, "GET /")).toHaveAttribute("aria-expanded", "false")
    await expect(row(page, "GET /")).toBeFocused()
  })

  test("Down and Up in a cell keep its column", async ({ page }) => {
    await row(page, "GET /app.css").focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowDown")
    await expect(cell(page, "GET /app.js", 1)).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowUp")
    await expect(cell(page, "GET /", 1)).toBeFocused()
  })

  test("Home and End in a cell go to the row's ends, and with Control to the column's", async ({
    page,
  }) => {
    await row(page, "GET /app.css").focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("End")
    await expect(bar(page, "GET /app.css")).toBeFocused()
    await page.keyboard.press("Home")
    await expect(cell(page, "GET /app.css", 0)).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("Control+End")
    await expect(cell(page, "GET /font.woff2", 1)).toBeFocused()
    await page.keyboard.press("Control+Home")
    await expect(cell(page, "GET /", 1)).toBeFocused()
  })

  test("a focused cell keeps the tab stop", async ({ page, tab }) => {
    await row(page, "GET /app.css").focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await expect(cell(page, "GET /app.css", 1)).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
    await tab({ shift: true })
    await expect(cell(page, "GET /app.css", 1)).toBeFocused()
  })

  test("Enter and Space select the focused row", async ({ page }) => {
    await row(page, "GET /app.css").focus()
    await page.keyboard.press("Enter")
    await expect(row(page, "GET /app.css")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press(" ")
    await expect(row(page, "GET /app.js")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await expect(row(page, "GET /app.css")).toHaveAttribute(
      "aria-selected",
      "false"
    )
    expect(await lastAction(page)).toBe("selected script")
  })

  test("typing moves to the next row whose name starts with it", async ({
    page,
  }) => {
    await row(page, "GET /").focus()
    await page.keyboard.type("GET /f")
    await expect(row(page, "GET /font.woff2")).toBeFocused()
  })
})

test.describe("time axis", () => {
  test("each row places its bar as a share of the range", async ({
    page,
    open,
  }) => {
    await open("waterfall", { expanded: "document" })
    const place = async (label: string) => [
      await variable(row(page, label), "--waterfall-start"),
      await variable(row(page, label), "--waterfall-size"),
    ]
    expect(await place("GET /")).toEqual(["0%", "50%"])
    expect(await place("GET /app.css")).toEqual(["6%", "17%"])
    await page.getByRole("button", { name: "Zoom" }).click()
    await expect.poll(() => place("GET /app.css")).toEqual(["0%", "0%"])
    expect(await place("GET /")).toEqual(["0%", "100%"])
  })

  test("each bar tells screen readers when its span starts and how long it lasts", async ({
    page,
    open,
  }) => {
    await open("waterfall", { expanded: "document" })
    await expect(bar(page, "GET /app.css")).toHaveAttribute(
      "aria-label",
      "GET /app.css, starts at 120 ms, lasts 340 ms"
    )
    await expect(bar(page, "GET /font.woff2")).toHaveAttribute(
      "aria-label",
      "GET /font.woff2, starts at 1 sec, lasts 1 sec"
    )
  })

  test("the axis shows round times, hidden from screen readers", async ({
    page,
    open,
  }) => {
    await open("waterfall")
    const axis = page.locator('[data-slot="waterfall-axis"]')
    await expect(axis).toHaveAttribute("aria-hidden", "true")
    await expect(axis.locator('[data-slot="waterfall-tick"]')).toHaveText([
      "0 sec",
      "0.5 sec",
      "1 sec",
      "1.5 sec",
    ])
    expect(
      await variable(
        axis.locator('[data-slot="waterfall-tick"]').nth(1),
        "--waterfall-tick"
      )
    ).toBe("25%")
    expect(
      await variable(
        page.locator('[data-slot="waterfall-mark"]'),
        "--waterfall-mark"
      )
    ).toBe("41%")
  })
})
