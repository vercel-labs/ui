import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// A navigation menu whose open item is bound to the app's own state: presses,
// Escape and the app opening and closing it each complete once, in order, and
// the menu writes no state of its own while the framework hands the value over.

const trigger = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true })
const completed = (page: Page) =>
  page.getByRole("status", { name: "Completed" })

// What the development build recorded writing while options were handed over.
const relays = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as Record<symbol, { relays?: unknown[] } | undefined>)[
        Symbol.for("ui-sdk.devtools.history@1")
      ]?.relays ?? []
  )

const setValue = (page: Page, value: string | null) =>
  page.evaluate(
    (next) =>
      (
        window as unknown as {
          setNavigationMenuValue: (value: string | null) => void
        }
      ).setNavigationMenuValue(next),
    value
  )

async function press(page: Page, name: string) {
  await trigger(page, name).focus()
  await page.keyboard.press("Enter")
}

for (const layout of ["viewport", "none"]) {
  test(`each open and close completes once, in order (${layout === "none" ? "no viewport" : "viewport"})`, async ({
    page,
    open,
  }) => {
    await open(
      "navigation-menu-bound",
      layout === "none" ? { viewport: "none" } : {}
    )
    await press(page, "Products")
    await expect(completed(page)).toHaveText("true")
    await press(page, "Resources")
    await expect(trigger(page, "Resources")).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await press(page, "Resources")
    await expect(completed(page)).toHaveText("true,false")
    await press(page, "Products")
    await expect(completed(page)).toHaveText("true,false,true")
    await page.keyboard.press("Escape")
    await expect(completed(page)).toHaveText("true,false,true,false")
    await setValue(page, "resources")
    await expect(completed(page)).toHaveText("true,false,true,false,true")
    await expect(trigger(page, "Resources")).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await setValue(page, null)
    await expect(completed(page)).toHaveText("true,false,true,false,true,false")
    expect(await relays(page)).toEqual([])
  })
}
