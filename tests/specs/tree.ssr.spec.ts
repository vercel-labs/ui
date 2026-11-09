import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const item = (page: Page, name: string) =>
  page.getByRole("treeitem", { name, exact: true })
const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("a tree hydrates without mismatches", async ({ page, open }) => {
  await open("tree", { expanded: "src" })
  await expect(item(page, "index.ts")).toBeVisible()
  await item(page, "docs").click()
  await expect(item(page, "intro.md")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server's markup has one tab stop, on the selected item", async ({
  page,
  open,
}) => {
  await open("tree", { expanded: "src", default: "index.ts" })
  await expect(page.locator('[role="treeitem"][tabindex="0"]')).toHaveCount(1)
  await expect(item(page, "index.ts")).toHaveAttribute("tabindex", "0")
  expect(await hydrationErrors(page)).toEqual([])
})

test("levels render on the server, and positions once items are in the page", async ({
  page,
  open,
}) => {
  await open("tree", { expanded: "src" })
  await expect(item(page, "legacy.ts")).toHaveAttribute("aria-level", "2")
  await expect(item(page, "legacy.ts")).toHaveAttribute("aria-posinset", "3")
  expect(await hydrationErrors(page)).toEqual([])
})

test("checked branches hydrate without mismatches", async ({ page, open }) => {
  await open("tree", {
    checkable: "",
    selection: "none",
    expanded: "src,components",
  })
  await item(page, "components")
    .locator(':scope > [data-slot="tree-checkbox"]')
    .click()
  await expect(item(page, "src")).toHaveAttribute("aria-checked", "mixed")
  expect(await hydrationErrors(page)).toEqual([])
})
