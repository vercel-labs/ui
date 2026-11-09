import { expect, expectFocus, menuNamed, test } from "../fixtures"
import { enter } from "./menubar.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("the menubar hydrates without mismatches and works", async ({
  page,
  open,
  tab,
}) => {
  await open("menubar")
  await page.waitForLoadState("networkidle")
  await enter(page, tab)
  await page.keyboard.press("ArrowDown")
  await expect(menuNamed(page, "File")).toBeVisible()
  await expectFocus(page, "New Tab")
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders exactly one tab stop in the menubar, on its first trigger", async ({
  page,
  open,
}) => {
  await open("menubar")
  const stops = await page.evaluate(() => {
    const markup = (window as unknown as { __serverMarkup: string })
      .__serverMarkup
    const doc = new DOMParser().parseFromString(markup, "text/html")
    return Array.from(
      doc.querySelectorAll('[role="menubar"] [tabindex="0"]')
    ).map((el) => el.textContent?.trim())
  })
  expect(stops).toEqual(["File"])
})
