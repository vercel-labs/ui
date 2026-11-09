import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// A controlled group changed in a transition, whose newly selected item
// suspends as it renders selected. React keeps the old selection on the page
// until the new one can commit, as it does with plain state, so the Suspense
// fallback never shows.

const fellBack = (page: Page) =>
  page.evaluate(() => "fellBack" in document.body.dataset)

const groups = [
  { group: "menu", role: "menuitemradio", checked: "aria-checked" },
  { group: "toggle", role: "button", checked: "aria-pressed" },
  { group: "checkbox", role: "checkbox", checked: "aria-checked" },
] as const

for (const { group, role, checked } of groups) {
  test(`a ${group} group shows its old selection until the new one can commit`, async ({
    page,
    open,
  }) => {
    await open("react-transitions", { group })
    const left = page.getByRole(role, { name: "Left" })
    const right = page.getByRole(role, { name: /^Right/ })
    await right.click()
    await page.waitForFunction(
      () =>
        (window as unknown as { detailsRendered: number }).detailsRendered > 0
    )
    expect(await fellBack(page)).toBe(false)
    await expect(left).toHaveAttribute(checked, "true")
    await expect(right).toHaveAttribute(checked, "false")
    await page.evaluate(() =>
      (window as unknown as { loadDetails: () => void }).loadDetails()
    )
    await expect(right).toHaveAttribute(checked, "true")
    await expect(right).toContainText("details")
    await expect(left).toHaveAttribute(checked, "false")
    expect(await fellBack(page)).toBe(false)
  })
}
