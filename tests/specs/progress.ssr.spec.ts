import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("progress bars hydrate without mismatches, and stay named", async ({
  page,
  open,
}) => {
  await open("progress")
  await page.waitForLoadState("networkidle")
  await expect(
    page.getByRole("progressbar", { name: "Uploading" })
  ).toHaveAttribute("aria-valuenow", "40")
  await page.getByRole("button", { name: "Advance" }).click()
  await expect(
    page.getByRole("progressbar", { name: "Uploading" })
  ).toHaveAttribute("aria-valuenow", "60")
  expect(await hydrationErrors(page)).toEqual([])
})
