import { expect, regionNamed, test, triggerNamed } from "../fixtures"

// Accordions have no direction-dependent keys. Right-to-left pages behave the same.

test.beforeEach(async ({ open }) => {
  await open("accordion", { dir: "rtl" })
})

test("triggers expand and collapse their panels", async ({ page }) => {
  await triggerNamed(page, "Returns").click()
  await expect(regionNamed(page, "Returns")).toBeVisible()
  await expect(triggerNamed(page, "Shipping")).toHaveAttribute(
    "aria-expanded",
    "false"
  )
})

test("the keyboard works the same", async ({ page, tab }) => {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expect(triggerNamed(page, "Shipping")).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(triggerNamed(page, "Shipping")).toHaveAttribute(
    "aria-expanded",
    "false"
  )
  await page.keyboard.press("ArrowLeft")
  await expect(triggerNamed(page, "Shipping")).toBeFocused()
})

test("panels open at their full width in a right-to-left page", async ({
  page,
}) => {
  const panel = regionNamed(page, "Shipping")
  const [trigger, region] = await Promise.all([
    triggerNamed(page, "Shipping").boundingBox(),
    panel.boundingBox(),
  ])
  expect(Math.round(region!.x + region!.width)).toBe(
    Math.round(trigger!.x + trigger!.width)
  )
})
