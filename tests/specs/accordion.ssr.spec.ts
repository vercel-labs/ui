import { expect, panelOf, regionNamed, test, triggerNamed } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("an accordion hydrates without mismatches", async ({ page, open }) => {
  await open("accordion")
  await expect(regionNamed(page, "Shipping")).toBeVisible()
  await triggerNamed(page, "Returns").click()
  await expect(regionNamed(page, "Returns")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("panels open on the server are open after hydration, at full height", async ({
  page,
  open,
}) => {
  await open("accordion", { multiple: "", default: "shipping,support" })
  for (const name of ["Shipping", "Support"]) {
    const panel = regionNamed(page, name)
    await expect(panel).toBeVisible()
    const [height, full] = await panel.evaluate((el) => [
      el.getBoundingClientRect().height,
      el.scrollHeight,
    ])
    expect(Math.round(height)).toBe(full)
  }
  expect(await hydrationErrors(page)).toEqual([])
})

test("panels hidden until found hydrate and stay findable", async ({
  page,
  open,
}) => {
  await open("accordion", { "hidden-until-found": "" })
  await expect(regionNamed(page, "Shipping")).toBeVisible()
  await expect(await panelOf(page, "Returns")).toHaveAttribute(
    "hidden",
    "until-found"
  )
  await triggerNamed(page, "Returns").click()
  await expect(regionNamed(page, "Returns")).toBeVisible()
  await triggerNamed(page, "Returns").click()
  await expect(await panelOf(page, "Returns")).toHaveAttribute(
    "hidden",
    "until-found"
  )
  expect(await hydrationErrors(page)).toEqual([])
})

test("kept panels hydrate without mismatches", async ({ page, open }) => {
  await open("accordion", { "keep-mounted": "" })
  await expect(regionNamed(page, "Shipping")).toBeVisible()
  await triggerNamed(page, "Support").click()
  await expect(regionNamed(page, "Support")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})
