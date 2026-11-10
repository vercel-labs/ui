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
  const { errors } = await openBehaviors(page, "selection")
  await expect(page.locator("[data-example]")).toHaveCount(9)
  expect(errors).toEqual([])
})

test("selection: clicks choose, Shift-clicks take a range, Control-clicks toggle, Control+A selects all", async ({
  page,
}) => {
  await openBehaviors(page, "selection")
  const list = page.getByRole("listbox", { name: "Files" })
  const file = (name: string) => list.getByRole("option", { name })
  await file("budget.xlsx").click()
  await file("slides.key").click({ modifiers: ["Shift"] })
  await expect(list.locator('[aria-selected="true"]')).toHaveCount(3)
  await file("photo.jpg").click({ modifiers: ["ControlOrMeta"] })
  await expect(file("photo.jpg")).toHaveAttribute("aria-selected", "false")
  await expect(lastLog(list)).toContainText("2 selected")
  await page.keyboard.press("ControlOrMeta+a")
  await expect(lastLog(list)).toContainText("6 selected")
})

test("selection: Shift with the arrows extends from the focused file", async ({
  page,
}) => {
  await openBehaviors(page, "selection")
  const list = page.getByRole("listbox", { name: "Files" })
  await list.getByRole("option", { name: "notes.md" }).click()
  await page.keyboard.press("Shift+ArrowDown")
  await page.keyboard.press("Shift+ArrowDown")
  await expect(lastLog(list)).toContainText("3 selected")
})

test("lasso: a rectangle selects the shapes it touches, and Escape lets go", async ({
  page,
}) => {
  await openBehaviors(page, "selection")
  const surface = page.getByLabel("Shapes")
  await surface.scrollIntoViewIfNeeded()
  const box = (await surface.boundingBox())!
  await page.mouse.move(box.x + 8, box.y + 8)
  await page.mouse.down()
  await page.mouse.move(box.x + 200, box.y + 70, { steps: 8 })
  await page.mouse.up()
  await expect(lastLog(surface)).toHaveText("Selected: Circle, Square")
  await page.mouse.move(box.x + 300, box.y + 200)
  await page.mouse.down()
  await page.mouse.move(box.x + 40, box.y + 100, { steps: 8 })
  await page.keyboard.press("Escape")
  await page.mouse.up()
  await expect(lastLog(surface)).toHaveText("Selected: Circle, Square")
})

test("cell range: Shift with the arrows grows the range, and the total follows", async ({
  page,
}) => {
  await openBehaviors(page, "selection")
  const grid = page.getByRole("grid", { name: "Numbers" })
  await grid.getByRole("gridcell", { name: "4", exact: true }).click()
  await expect(page.getByText("Total: 4")).toBeVisible()
  await page.keyboard.press("Shift+ArrowRight")
  await page.keyboard.press("Shift+ArrowDown")
  await expect(page.getByText("Total: 77")).toBeVisible()
  await expect(grid.locator('[aria-selected="true"]')).toHaveCount(4)
})

test("cell range: a drag paints the range", async ({ page }) => {
  await openBehaviors(page, "selection")
  const grid = page.getByRole("grid", { name: "Numbers" })
  await grid.scrollIntoViewIfNeeded()
  const from = (await grid
    .getByRole("gridcell", { name: "15", exact: true })
    .boundingBox())!
  const to = (await grid
    .getByRole("gridcell", { name: "5", exact: true })
    .boundingBox())!
  await page.mouse.move(from.x + 10, from.y + 10)
  await page.mouse.down()
  await page.mouse.move(to.x + 10, to.y + 10, { steps: 8 })
  await page.mouse.up()
  await expect(page.getByText("Total: 56")).toBeVisible()
})

test("choose one: a click chooses, Space clears the chosen plan, and Enter goes on with it", async ({
  page,
}) => {
  await openBehaviors(page, "selection")
  const list = page.getByRole("listbox", { name: "Plan" })
  const chosen = lastLog(list)
  await list.getByRole("option", { name: "Pro" }).click()
  await expect(chosen).toHaveText("Chose Pro")
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Space")
  await expect(chosen).toHaveText("Chose Team")
  await expect(list.locator('[aria-selected="true"]')).toHaveCount(1)
  await page.keyboard.press("Space")
  await expect(chosen).toHaveText("Cleared the plan")
  await page.keyboard.press("Space")
  await page.keyboard.press("Enter")
  await expect(chosen).toHaveText("Continuing with Team")
})

test("choose many: each click adds or takes off one topping", async ({
  page,
}) => {
  await openBehaviors(page, "selection")
  const list = page.getByRole("listbox", { name: "Toppings" })
  const selected = list.locator('[aria-selected="true"]')
  await expect(selected).toHaveText(["Cheese"])
  await list.getByRole("option", { name: "Olives" }).click()
  await expect(selected).toHaveText(["Cheese", "Olives"])
  await list.getByRole("option", { name: "Cheese" }).click()
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Space")
  await expect(selected).toHaveText(["Basil", "Olives"])
})

test("ranges: a range adds to what was selected, or replaces it with the box ticked", async ({
  page,
}) => {
  await openBehaviors(page, "selection")
  const list = page.getByRole("listbox", { name: "Files" })
  const file = (name: string) => list.getByRole("option", { name })
  await file("notes.md").click()
  await file("photo.jpg").click({ modifiers: ["ControlOrMeta"] })
  await file("slides.key").click({ modifiers: ["Shift"] })
  await expect(list.locator('[aria-selected="true"]')).toHaveText([
    "notes.md",
    "photo.jpg",
    "slides.key",
  ])
  await page
    .getByRole("checkbox", { name: "Ranges replace the selection" })
    .check()
  await file("notes.md").click()
  await file("photo.jpg").click({ modifiers: ["ControlOrMeta"] })
  await file("draft.docx").click({ modifiers: ["Shift"] })
  await expect(list.locator('[aria-selected="true"]')).toHaveText([
    "photo.jpg",
    "slides.key",
    "draft.docx",
  ])
})

test("selectable: owners stay selected through clicks and select all", async ({
  page,
}) => {
  await openBehaviors(page, "selection")
  const list = page.getByRole("listbox", { name: "Members" })
  const selected = list.locator('[aria-selected="true"]')
  await expect(selected).toHaveCount(1)
  await list
    .getByRole("option", { name: /^Hollis Grant/ })
    .click({ force: true })
  await expect(selected).toHaveCount(1)
  await page.keyboard.press("ControlOrMeta+a")
  await expect(selected).toHaveCount(5)
  await page.keyboard.press("ControlOrMeta+a")
  await expect(selected).toHaveCount(1)
  await expect(
    list.getByRole("option", { name: /^Hollis Grant/ })
  ).toHaveAttribute("aria-selected", "true")
})

test("lasso: locked photos stay out, and screen readers hear how many were selected", async ({
  page,
}) => {
  await openBehaviors(page, "selection")
  const surface = page.locator('[data-slot="photos"]')
  await surface.scrollIntoViewIfNeeded()
  const box = (await surface.boundingBox())!
  await page.mouse.move(box.x + 4, box.y + 4)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width - 4, box.y + box.height - 4, {
    steps: 8,
  })
  await page.mouse.up()
  await expect(surface.locator("[data-selected]")).toHaveCount(4)
  await expect(
    surface.locator("[data-selected]").filter({ hasText: "City" })
  ).toHaveCount(0)
  await expect(page.locator("[data-ui-sdk-announcer='']")).toHaveText(
    "4 photos selected"
  )
})

test("cell range from code: columns, rows, a block and everything, named and counted", async ({
  page,
}) => {
  await openBehaviors(page, "selection")
  const grid = page.getByRole("grid", { name: "Ledger" })
  const summary = page.locator("[data-summary]")
  await page.getByRole("button", { name: "Column B" }).click()
  await expect(summary).toHaveText("B1:B3, 1 over 10")
  await page.getByRole("button", { name: "Rows 1 and 2" }).click()
  await expect(summary).toHaveText("A1:D2, 4 over 10")
  await page.getByRole("button", { name: "B2 to C3" }).click()
  await expect(grid.locator('[aria-selected="true"]')).toHaveCount(4)
  await expect(summary).toHaveText("B2:C3, 2 over 10")
  await page.getByRole("button", { name: "All", exact: true }).click()
  await expect(summary).toHaveText("A1:D3, 5 over 10")
  await grid.getByRole("gridcell", { name: "8", exact: true }).click()
  await page.keyboard.press("Shift+ArrowDown")
  await expect(page.locator("[data-ui-sdk-announcer='']")).toHaveText(
    "B1 to B2 selected"
  )
})

test("cell range clipboard: copy the range as tabs, and paste it from another cell", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await openBehaviors(page, "selection")
  const grid = page.getByRole("grid", { name: "Prices" })
  const copied = lastLog(grid)
  await grid.getByRole("gridcell", { name: "Tea" }).click()
  await page.keyboard.press("Shift+ArrowRight")
  await page.keyboard.press("Shift+ArrowDown")
  await page.keyboard.press("ControlOrMeta+c")
  await expect(copied).toHaveText('Copied "Tea\\t3\\nCoffee\\t4"')
  const rows = grid.getByRole("row")
  await rows.nth(3).getByRole("gridcell").first().click()
  await page.keyboard.press("ControlOrMeta+v")
  await expect(rows.nth(3).getByRole("gridcell")).toHaveText(["Tea", "3", ""])
  await page.getByRole("button", { name: "Copy Whole Sheet" }).click()
  await expect(copied).toContainText("Cake\\t5\\t4")
})

test("every option links to its explanation", async ({ page }) => {
  await openBehaviors(page, "selection")
  for (const label of [
    "SelectionOptions",
    "LassoOptions",
    "CellRangeOptions",
  ]) {
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
