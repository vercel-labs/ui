import { expect, test } from "../fixtures"

const bar = (page: import("@playwright/test").Page, name: string) =>
  page.getByRole("progressbar", { name, exact: true })

test.beforeEach(async ({ open }) => {
  await open("progress")
})

// Screen readers already say a bar without a value is busy. Text in one
// language would be read as is to everyone else.
test("an indeterminate bar announces no text of its own @enhancement", async ({
  page,
}) => {
  await expect(bar(page, "Loading")).not.toHaveAttribute("aria-valuetext")
})

test("the bar exposes how full it is as a CSS variable @enhancement", async ({
  page,
}) => {
  const upload = bar(page, "Uploading")
  await expect
    .poll(() =>
      upload.evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--progress-value")
      )
    )
    .toBe("40%")
  await page.getByRole("button", { name: "Advance" }).click()
  await expect
    .poll(() =>
      upload
        .locator(".gauge-indicator")
        .evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--progress-value")
        )
    )
    .toBe("60%")
})
