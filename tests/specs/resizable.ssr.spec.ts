import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { editorSpace, panel, sidebarHandle } from "./resizable.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("groups hydrate without mismatches", async ({ page, open }) => {
  await open("resizable")
  await sidebarHandle(page).focus()
  await page.keyboard.press("ArrowRight")
  await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "26")
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server markup lays panels out at their default sizes before hydration", async ({
  page,
  open,
}) => {
  await open("resizable", { hydrate: "manual" })
  expect(
    Math.abs(
      (await panel(page, "Sidebar").boundingBox())!.width - editorSpace / 4
    )
  ).toBeLessThan(2)
  expect(
    Math.abs(
      (await panel(page, "Preview").boundingBox())!.width - editorSpace / 4
    )
  ).toBeLessThan(2)
  expect(
    Math.abs((await panel(page, "Code").boundingBox())!.height - 298 * 0.7)
  ).toBeLessThan(2)
})

// Before hydration, percentages are of the whole group. After, of what the
// handles leave, so panels move by less than the handles' width.
test("panels barely move when the page hydrates", async ({ page, open }) => {
  await open("resizable", { hydrate: "manual" })
  const before = (await panel(page, "Main").boundingBox())!.width
  await page.evaluate(() =>
    (window as unknown as { hydrate: () => void }).hydrate()
  )
  await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "25")
  expect(
    Math.abs((await panel(page, "Main").boundingBox())!.width - before)
  ).toBeLessThan(4)
  expect(await hydrationErrors(page)).toEqual([])
})
