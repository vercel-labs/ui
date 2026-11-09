import { expect, test } from "../fixtures"
import { paginationFixture as f } from "../fixtures/pagination"
import { current, part, range } from "./pagination.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("a pagination hydrates without mismatches and pages", async ({
  page,
  open,
}) => {
  await open("pagination", { page: "5" })
  await page.waitForLoadState("networkidle")
  expect(await range(page)).toBe("1 … 4 5 6 … 10")
  await part(page, f.next).click()
  expect(await current(page)).toEqual(["6"])
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders links with their hrefs, and the ends without", async ({
  page,
  open,
}) => {
  await open("pagination", { links: "" })
  await expect(part(page, 2, "link")).toHaveAttribute("href", "#page-2")
  await expect(part(page, f.previous, "link")).not.toHaveAttribute("href")
  expect(await hydrationErrors(page)).toEqual([])
})
