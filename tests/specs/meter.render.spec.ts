import { expect, test } from "../fixtures"

// Parts render as any element, through `render` in every framework, and render
// functions receive the part's state.
test.describe("custom rendering", () => {
  test.beforeEach(async ({ open }) => {
    await open("meter-render")
  })

  test("a meter rendered as a section keeps its role and value", async ({
    page,
  }) => {
    const meter = page.getByRole("meter", { name: "Memory" })
    expect(await meter.evaluate((el) => el.tagName)).toBe("SECTION")
    await expect(meter).toHaveAttribute("aria-valuenow", "40")
  })

  test("render functions receive the meter's state", async ({ page }) => {
    const meter = page.getByRole("meter", { name: "Memory" })
    await expect(meter).toContainText("40% used")
    await expect(meter).toHaveClass(/is-ok/)
    await page.getByRole("button", { name: "Fill" }).click()
    await expect(meter).toContainText("90% used")
    await expect(meter).toHaveClass(/is-high/)
  })
})
