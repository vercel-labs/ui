import type { Page } from "@playwright/test"
import { expect, shortcutKeys, test } from "../fixtures"
import { tooltipFixture } from "../fixtures/tooltip"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

// The fixture hydrates without a signal, so wait until a hover opens a tooltip.
async function hoverSave(page: Page) {
  await expect(async () => {
    await page.mouse.move(0, 0)
    await page.getByRole("button", { name: "Save", exact: true }).hover()
    await expect(page.getByRole("tooltip")).toBeVisible({ timeout: 500 })
  }).toPass()
}

test("closed tooltips hydrate without mismatches", async ({ page, open }) => {
  await open("tooltip")
  await hoverSave(page)
  expect(await hydrationErrors(page)).toEqual([])
})

test("an open tooltip hydrates without mismatches and leaves focus alone", async ({
  page,
  open,
}) => {
  await open("tooltip", { open: "" })
  await expect(page.getByRole("tooltip")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
  expect(
    await page.evaluate(() => document.activeElement === document.body)
  ).toBe(true)
})

test(
  "server HTML already describes the trigger",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("tooltip")
    await expect(
      page.getByRole("button", { name: "Save", exact: true })
    ).toHaveAccessibleDescription(/^Save your changes/)
  }
)

test("a Shortcut part in a trigger connected through a controller hydrates without mismatches, then shows the keys for this platform", async ({
  page,
  open,
}) => {
  await open("tooltip", { shortcut: "" })
  const trigger = page.getByRole("button", {
    name: tooltipFixture.shortcut.trigger,
    exact: true,
  })
  await expect(trigger.locator("[data-slot=tooltip-shortcut]")).toHaveText(
    (await shortcutKeys(page, "S")).text
  )
  expect(await hydrationErrors(page)).toEqual([])
})
