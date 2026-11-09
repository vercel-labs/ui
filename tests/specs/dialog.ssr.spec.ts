import type { Page } from "@playwright/test"
import { expect, shortcutKeys, test } from "../fixtures"
import { dialogFixture } from "../fixtures/dialog"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("a closed dialog hydrates without mismatches", async ({ page, open }) => {
  await open("dialog")
  await page.getByRole("button", { name: "Edit profile" }).click()
  await expect(
    page.getByRole("dialog", { name: "Profile settings" })
  ).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("an open dialog hydrates without mismatches and then moves focus inside", async ({
  page,
  open,
}) => {
  await open("dialog", { open: "" })
  await expect(
    page.getByRole("dialog", { name: "Profile settings" })
  ).toBeVisible()
  await expect(
    page.getByRole("textbox", { name: "Display name" })
  ).toBeFocused()
  expect(await hydrationErrors(page)).toEqual([])
})

test("an open dialog is visible before it hydrates", async ({ page, open }) => {
  await open("dialog", { open: "" })
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __visibleBeforeHydration: boolean })
          .__visibleBeforeHydration
    )
  ).toBe(true)
})

test("a Shortcut part in a trigger connected through a controller hydrates without mismatches, then shows the keys for this platform", async ({
  page,
  open,
}) => {
  await open("dialog", { shortcut: "" })
  const trigger = page.getByRole("button", {
    name: dialogFixture.shortcut.trigger,
    exact: true,
  })
  await expect(trigger.locator("[data-slot=dialog-shortcut]")).toHaveText(
    (await shortcutKeys(page, "E")).text
  )
  expect(await hydrationErrors(page)).toEqual([])
})
