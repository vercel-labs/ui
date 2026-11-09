import { collapsibleFixture as fixture } from "../fixtures/collapsible"
import { expect, test } from "../fixtures"

// A collapsible has no direction-dependent keys. Right-to-left pages behave the same.

test("the trigger and keyboard work the same right to left", async ({
  page,
  open,
}) => {
  await open("collapsible", { dir: "rtl" })
  const trigger = page.getByRole("button", {
    name: fixture.trigger,
    exact: true,
  })
  await trigger.click()
  await expect(page.getByText(fixture.content)).toBeVisible()
  await page.keyboard.press("Enter")
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(trigger).toBeFocused()
})
