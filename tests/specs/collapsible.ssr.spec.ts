import type { Page } from "@playwright/test"
import { collapsibleFixture as fixture } from "../fixtures/collapsible"
import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )
const trigger = (page: Page) =>
  page.getByRole("button", { name: fixture.trigger, exact: true })
const panel = (page: Page) => page.locator(".collapsible-panel")

test("a collapsible hydrates without mismatches", async ({ page, open }) => {
  await open("collapsible")
  await trigger(page).click()
  await expect(page.getByText(fixture.content)).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("a panel open on the server is open after hydration, at full height", async ({
  page,
  open,
}) => {
  await open("collapsible", { open: "" })
  await expect(page.getByText(fixture.content)).toBeVisible()
  const [height, full] = await panel(page).evaluate((el) => [
    el.getBoundingClientRect().height,
    el.scrollHeight,
  ])
  expect(Math.round(height)).toBe(full)
  expect(await hydrationErrors(page)).toEqual([])
})

test("a panel hidden until found hydrates and stays findable", async ({
  page,
  open,
}) => {
  await open("collapsible", { "hidden-until-found": "" })
  await expect(panel(page)).toHaveAttribute("hidden", "until-found")
  await trigger(page).click()
  await expect(page.getByText(fixture.content)).toBeVisible()
  await trigger(page).click()
  await expect(panel(page)).toHaveAttribute("hidden", "until-found")
  expect(await hydrationErrors(page)).toEqual([])
})
