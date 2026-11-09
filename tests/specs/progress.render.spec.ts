import { expect, test } from "../fixtures"

// Parts render as any element, through `render` in React and the `render` slot in
// Vue, and render functions receive the part's state. One fixture covers
// Progress, Avatar and OTP Input.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("progress-render")
  })

  test("a progress bar rendered as a section keeps its role and value", async ({
    page,
  }) => {
    const bar = page.getByRole("progressbar", { name: "Export" })
    expect(await bar.evaluate((el) => el.tagName)).toBe("SECTION")
    await expect(bar).toHaveAttribute("aria-valuenow", "40")
  })

  test("render functions receive the progress bar's state", async ({
    page,
  }) => {
    const bar = page.getByRole("progressbar", { name: "Export" })
    await expect(bar).toContainText("40% done")
    await page.getByRole("button", { name: "Finish" }).click()
    await expect(bar).toContainText("100% done")
    await expect(bar).toHaveClass(/is-complete/)
  })

  test("an avatar's fallback reads its loading status", async ({ page }) => {
    await expect(page.locator(".avatar").locator(".is-idle")).toHaveText("RF")
    expect(await page.locator(".avatar").evaluate((el) => el.tagName)).toBe(
      "DIV"
    )
  })

  test("slots render their character and state through functions", async ({
    page,
  }) => {
    const pin = page.getByRole("textbox", { name: "PIN" })
    expect(await page.locator("section.otp").count()).toBe(1)
    await expect(page.locator(".otp-slot").first()).toHaveText("·")
    await pin.focus()
    await page.keyboard.type("42")
    await expect(page.locator(".otp-slot").nth(1)).toHaveText("2")
    await expect(page.locator(".otp .is-active")).toHaveCount(1)
  })
})
