import { expect, test } from "../fixtures"

const meter = (page: import("@playwright/test").Page, name: string) =>
  page.getByRole("meter", { name, exact: true })

test.beforeEach(async ({ open }) => {
  await open("meter")
})

test("the meter exposes where its value sits as a CSS variable @enhancement", async ({
  page,
}) => {
  const storage = meter(page, "Storage")
  await expect
    .poll(() =>
      storage.evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--meter-value")
      )
    )
    .toBe("60%")
  await page.getByRole("button", { name: "Fill" }).click()
  await expect
    .poll(() =>
      storage
        .locator(".gauge-indicator")
        .evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--meter-value")
        )
    )
    .toBe("80%")
  await expect
    .poll(() =>
      meter(page, "Score").evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--meter-value")
      )
    )
    .toBe("50%")
})
