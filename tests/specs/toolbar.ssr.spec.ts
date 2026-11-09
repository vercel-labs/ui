import { expect, expectFocus, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

// The names of the server markup's tab stops inside the element with this role.
const serverStops = (page: import("@playwright/test").Page, role: string) =>
  page.evaluate((role) => {
    const markup = (window as unknown as { __serverMarkup: string })
      .__serverMarkup
    const doc = new DOMParser().parseFromString(markup, "text/html")
    return Array.from(
      doc.querySelectorAll(`[role="${role}"] [tabindex="0"]`)
    ).map((el) => el.getAttribute("aria-label") ?? el.textContent?.trim())
  }, role)

test("the toolbar hydrates without mismatches and works", async ({
  page,
  open,
  tab,
}) => {
  await open("toolbar")
  await page.waitForLoadState("networkidle")
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expectFocus(page, "Bold")
  await page.keyboard.press("ArrowRight")
  await expectFocus(page, "Italic")
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders exactly one tab stop in the toolbar, on its first item", async ({
  page,
  open,
}) => {
  await open("toolbar")
  expect(await serverStops(page, "toolbar")).toEqual(["Bold"])
})
