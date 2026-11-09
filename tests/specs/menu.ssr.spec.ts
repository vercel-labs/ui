import { expect, menuNamed, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("a closed menu hydrates without mismatches", async ({ page, open }) => {
  await open("menu")
  await page.getByRole("button", { name: "File" }).click()
  await expect(menuNamed(page, "File")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("an open menu hydrates without mismatches, then shows the platform's shortcuts", async ({
  page,
  open,
}) => {
  await open("menu", { open: "" })
  await expect(menuNamed(page, "File")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
  const apple = await page.evaluate(() =>
    /Mac|iPhone|iPad/.test(navigator.platform)
  )
  await expect(
    page.getByRole("menuitem", { name: "New file" })
  ).toHaveAttribute("aria-keyshortcuts", apple ? "Meta+N" : "Control+N")
})

test("an open menu is visible before it hydrates", async ({ page, open }) => {
  await open("menu", { open: "" })
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __visibleBeforeHydration: boolean })
          .__visibleBeforeHydration
    )
  ).toBe(true)
})
