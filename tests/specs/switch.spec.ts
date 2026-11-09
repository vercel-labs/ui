import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"
import { fillRequired, submitted, switchNamed } from "./forms.helpers"

// Behavior follows the WAI-ARIA switch pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/switch/

test.beforeEach(async ({ open }) => {
  await open("forms")
})

test("starts in its default state", async ({ page }) => {
  await expect(switchNamed(page, "Wi-Fi")).toHaveAttribute(
    "aria-checked",
    "true"
  )
  await expect(switchNamed(page, "Airplane mode")).toHaveAttribute(
    "aria-checked",
    "false"
  )
})

test("clicking toggles it", async ({ page }) => {
  const wifi = switchNamed(page, "Wi-Fi")
  await wifi.click()
  await expect(wifi).toHaveAttribute("aria-checked", "false")
  expect(await lastAction(page)).toBe("wifi:false")
  await wifi.click()
  await expect(wifi).toHaveAttribute("aria-checked", "true")
})

test("clicking its label toggles it", async ({ page }) => {
  await page.getByText("Airplane mode", { exact: true }).click()
  await expect(switchNamed(page, "Airplane mode")).toBeChecked()
})

test("Space toggles it", async ({ page }) => {
  const airplane = switchNamed(page, "Airplane mode")
  await airplane.focus()
  await page.keyboard.press(" ")
  await expect(airplane).toBeChecked()
})

// Native switches (<input type="checkbox" switch>) submit on Enter, like checkboxes.
test(
  "Enter submits the form and never toggles it",
  { tag: "@enhancement" },
  async ({ page }) => {
    await fillRequired(page)
    const airplane = switchNamed(page, "Airplane mode")
    await airplane.focus()
    await page.keyboard.press("Enter")
    await expect(airplane).not.toBeChecked()
    await expect.poll(() => submitted(page)).toContain("wifi=on")
  }
)

test("the thumb follows the state", async ({ page }) => {
  const thumb = switchNamed(page, "Airplane mode").locator(".switch-thumb")
  await expect(thumb).toHaveAttribute("data-unchecked", "")
  await switchNamed(page, "Airplane mode").click()
  await expect(thumb).toHaveAttribute("data-checked", "")
})

// Nothing on the page has seen a key or a pointer before these presses, so
// their source shows the input listeners were in place before the first one.
test.describe("the first input on a page", { tag: "@enhancement" }, () => {
  const source = (page: Page) =>
    page.locator('output[aria-label="Last source"]')

  test("the first Space reports keyboard", async ({ page }) => {
    const airplane = switchNamed(page, "Airplane mode")
    await airplane.focus()
    await page.keyboard.press(" ")
    await expect(airplane).toBeChecked()
    await expect(source(page)).toHaveText("keyboard")
  })

  test.describe("on a touch screen", () => {
    test.use({ hasTouch: true })

    test("the first tap reports touch", async ({ page, browserName }) => {
      test.skip(
        browserName === "firefox",
        "Firefox doesn't support touch emulation."
      )
      const airplane = switchNamed(page, "Airplane mode")
      await airplane.tap()
      await expect(airplane).toBeChecked()
      await expect(source(page)).toHaveText("touch")
    })
  })
})
