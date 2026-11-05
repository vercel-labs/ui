import { expect } from "@playwright/test"
import { test } from "../../docs-test"
import { openBehaviors } from "./helpers"

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openBehaviors(page, "trees")
  await expect(page.locator("[data-example]")).toHaveCount(6)
  expect(errors).toEqual([])
})

test("outline: each section shows its level, its place and its parent", async ({ page }) => {
  await openBehaviors(page, "trees")
  await expect(page.locator('[data-section="hello"]')).toContainText("Level 2, 2 of 2 in Basics")
  await expect(page.locator('[data-section="extras"]')).toContainText("▸ Extras")
  await expect(page.locator('[data-section="extras"]')).toContainText("Level 1, 3 of 3")
  await expect(page.getByText("6 sections, no appendix yet")).toBeVisible()
})

test("expand: folders open and close, count their files, and the path follows the pick", async ({ page }) => {
  await openBehaviors(page, "trees")
  const row = (name: string) => page.locator('[data-slot="file-list-row"]', { hasText: name })
  await expect(row("lib")).toHaveAttribute("aria-expanded", "false")
  await expect(row("date.ts")).toHaveCount(0)
  await expect(row("src")).toContainText("3 files")
  await row("lib").click()
  await row("date.ts").click()
  await expect(page.locator("[data-path]")).toHaveText("src / lib / date.ts")
  await row("src").click()
  await expect(row("date.ts")).toHaveCount(0)
  await page.locator('[data-slot="file-list-expand"]').click()
  await expect(row("intro.md")).toBeVisible()
  await expect(row("date.ts")).toBeVisible()
})

test("paths: lines become folders first, and a trailing slash is an empty folder", async ({ page }) => {
  await openBehaviors(page, "trees")
  const tree = page.locator("[data-tree]")
  await expect(tree.locator("span")).toHaveText([
    "📁 src",
    "📁 lib",
    "util.ts",
    "index.ts",
    "📁 assets",
    "README.md",
  ])
  await page.getByLabel("Paths").fill("b.txt\na/c.txt")
  await expect(tree.locator("span")).toHaveText(["📁 a", "c.txt", "b.txt"])
})

test("flat rows: open sections show their rows, links have addresses, and the retired page is disabled", async ({
  page,
}) => {
  await openBehaviors(page, "trees")
  await expect(page.getByRole("link", { name: /^Install/ })).toHaveAttribute("href", "#install")
  await expect(page.getByText(/^Old setup/)).toHaveAttribute("aria-disabled", "true")
  await expect(page.getByRole("link", { name: /^Theming/ })).toHaveCount(0)
  await page.getByRole("button", { name: /^Guides/ }).click()
  await expect(page.getByRole("link", { name: /^Theming/ })).toContainText("row 5, in guides")
})

test("strategies: each lists its own nodes, a value reads across them, and a locked file stays", async ({
  page,
}) => {
  await openBehaviors(page, "trees")
  const group = page.getByRole("group", { name: "Backup" })
  const box = (name: string) => group.getByRole("checkbox", { name, exact: true })
  const value = group.locator("[data-value]")
  const strategy = (name: string) =>
    page.getByRole("radiogroup", { name: "Strategy" }).last().getByRole("radio", { name })
  await box("Photos").click()
  await expect(value).toHaveText("Value: beach.jpg, city.jpg")
  await expect(box("Photos")).toHaveAttribute("aria-checked", "mixed")
  await expect(box("locked.jpg")).toHaveAttribute("aria-checked", "false")
  await box("notes.txt").click()
  await strategy("trunk").click()
  await expect(value).toHaveText("Value: beach.jpg, city.jpg, notes.txt")
  await box("locked.jpg").click({ force: true })
  await expect(box("locked.jpg")).toHaveAttribute("aria-checked", "false")
  await box("Photos").click()
  await expect(value).toHaveText("Value: notes.txt")
  await strategy("branch").click()
  await box("city.jpg").click()
  await expect(value).toHaveText("Value: city.jpg, notes.txt")
  await strategy("independent").click()
  await box("Photos").click()
  await expect(box("Photos")).toHaveAttribute("aria-checked", "true")
  await expect(box("beach.jpg")).toHaveAttribute("aria-checked", "false")
})

test("tree data fields link to the example that shows them", async ({ page }) => {
  await openBehaviors(page, "trees")
  for (const label of ["TreeItemData"]) {
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

test("the link to rows that aren't rendered lands on its heading", async ({ page }) => {
  await openBehaviors(page, "trees")
  await page.getByRole("link", { name: "rows that aren't rendered" }).click()
  await expect(page).toHaveURL(/\/docs\/core\/behaviors\/focus#rows-that-arent-rendered$/)
  await expect(page.locator('[id="rows-that-arent-rendered"]')).toHaveCount(1)
})
