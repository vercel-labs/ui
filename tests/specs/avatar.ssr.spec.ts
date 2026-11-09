import { expect, test } from "../fixtures"
import { fallbackOf, routeAvatars } from "./avatar.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("avatars hydrate without mismatches, and loaded images replace their fallbacks", async ({
  page,
  open,
}) => {
  await routeAvatars(page)
  await open("avatar")
  await page.waitForLoadState("networkidle")
  await expect(page.getByRole("img", { name: "Ada Lovelace" })).toBeVisible()
  await expect(fallbackOf(page, 0, "AL")).toBeHidden()
  await expect(fallbackOf(page, 1, "GH")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})
