import { expect, lastAction, slowTransitions, test } from "../fixtures"
import { checkbox, fillRequired, radio, submitted, switchNamed } from "./forms.helpers"

// Behavior follows the WAI-ARIA radio group pattern, and native radios:
// https://www.w3.org/WAI/ARIA/apg/patterns/radio/

// Tabs from the last switch into the group.
async function enter(page: import("@playwright/test").Page, tab: () => Promise<void>) {
  await switchNamed(page, "Airplane mode").focus()
  await tab()
}

test.describe("selection", () => {
  test.beforeEach(async ({ open }) => {
    await open("forms")
  })

  test("nothing is checked at first without a default value", async ({ page }) => {
    for (const name of ["Free", "Pro", "Team", "Enterprise"])
      await expect(radio(page, name)).not.toBeChecked()
  })

  test("clicking an item checks it and unchecks the others", async ({ page }) => {
    await radio(page, "Pro").click()
    await expect(radio(page, "Pro")).toBeChecked()
    expect(await lastAction(page)).toBe("plan:pro")
    await radio(page, "Free").click()
    await expect(radio(page, "Free")).toBeChecked()
    await expect(radio(page, "Pro")).not.toBeChecked()
  })

  test("clicking an item's label checks it", async ({ page }) => {
    await page.getByText("Enterprise", { exact: true }).click()
    await expect(radio(page, "Enterprise")).toBeChecked()
  })

  test("clicking a disabled item does nothing", async ({ page }) => {
    await radio(page, "Team").click({ force: true })
    await expect(radio(page, "Team")).not.toBeChecked()
    expect(await lastAction(page)).toBe("")
  })

  test("a change can be cancelled", async ({ page, open }) => {
    await open("forms", { cancel: "plan" })
    await radio(page, "Pro").click()
    await expect(radio(page, "Pro")).not.toBeChecked()
  })
})

test.describe("keyboard", () => {
  test("Tab lands on the first item when nothing is checked", async ({ page, open, tab }) => {
    await open("forms")
    await enter(page, tab)
    await expect(radio(page, "Free")).toBeFocused()
    await expect(radio(page, "Free")).not.toBeChecked()
  })

  test("Tab lands on the checked item", async ({ page, open, tab }) => {
    await open("forms", { plan: "enterprise" })
    await enter(page, tab)
    await expect(radio(page, "Enterprise")).toBeFocused()
  })

  test("Tab leaves the group after one stop", async ({ page, open, tab }) => {
    await open("forms", { plan: "pro" })
    await enter(page, tab)
    await expect(radio(page, "Pro")).toBeFocused()
    await tab()
    await expect(page.getByRole("textbox", { name: "Email" })).toBeFocused()
  })

  test("Space checks the focused item", async ({ page, open, tab }) => {
    await open("forms")
    await enter(page, tab)
    await page.keyboard.press(" ")
    await expect(radio(page, "Free")).toBeChecked()
  })

  test("ArrowDown and ArrowRight move to the next item and check it", async ({ page, open, tab }) => {
    await open("forms", { plan: "free" })
    await enter(page, tab)
    await page.keyboard.press("ArrowDown")
    await expect(radio(page, "Pro")).toBeFocused()
    await expect(radio(page, "Pro")).toBeChecked()
    expect(await lastAction(page)).toBe("plan:pro")
    await page.keyboard.press("ArrowRight")
    await expect(radio(page, "Enterprise")).toBeFocused()
    await expect(radio(page, "Enterprise")).toBeChecked()
  })

  test("ArrowUp and ArrowLeft move to the previous item and check it", async ({ page, open, tab }) => {
    await open("forms", { plan: "enterprise" })
    await enter(page, tab)
    await page.keyboard.press("ArrowUp")
    await expect(radio(page, "Pro")).toBeFocused()
    await expect(radio(page, "Pro")).toBeChecked()
    await page.keyboard.press("ArrowLeft")
    await expect(radio(page, "Free")).toBeFocused()
    await expect(radio(page, "Free")).toBeChecked()
  })

  test("arrow keys skip disabled items", async ({ page, open, tab }) => {
    await open("forms", { plan: "pro" })
    await enter(page, tab)
    await page.keyboard.press("ArrowDown")
    await expect(radio(page, "Enterprise")).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(radio(page, "Pro")).toBeFocused()
  })

  test("arrow keys wrap at both ends", async ({ page, open, tab }) => {
    await open("forms", { plan: "enterprise" })
    await enter(page, tab)
    await page.keyboard.press("ArrowDown")
    await expect(radio(page, "Free")).toBeFocused()
    await expect(radio(page, "Free")).toBeChecked()
    await page.keyboard.press("ArrowUp")
    await expect(radio(page, "Enterprise")).toBeFocused()
  })

  test("Enter never checks an item", async ({ page, open, tab }) => {
    await open("forms")
    await enter(page, tab)
    await page.keyboard.press("Enter")
    await expect(radio(page, "Free")).not.toBeChecked()
  })

  test("keys pressed in quick succession are never lost", async ({ page, open, tab }) => {
    await open("forms", { plan: "free" })
    await enter(page, tab)
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(radio(page, "Free")).toBeFocused()
    await expect(radio(page, "Free")).toBeChecked()
  })

  test("Enter on an item submits the form", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("forms")
    await fillRequired(page)
    await radio(page, "Pro").focus()
    await page.keyboard.press("Enter")
    await expect.poll(() => submitted(page)).toContain("plan=pro")
    await expect(checkbox(page, "Accept the terms")).toBeChecked()
  })
})

test.describe("read-only and disabled", () => {
  test("a read-only group moves focus with arrow keys but checks nothing", async ({ page, open, tab }) => {
    await open("forms", { readonly: "", plan: "free" })
    await expect(page.getByRole("radiogroup")).toHaveAttribute("aria-readonly", "true")
    await enter(page, tab)
    await expect(radio(page, "Free")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(radio(page, "Pro")).toBeFocused()
    await expect(radio(page, "Free")).toBeChecked()
    await radio(page, "Enterprise").click()
    await expect(radio(page, "Free")).toBeChecked()
  })

  test(
    "a disabled group can't be focused or changed",
    { tag: "@enhancement" },
    async ({ page, open, tab }) => {
      await open("forms", { disabled: "" })
      await radio(page, "Pro").click({ force: true })
      await expect(radio(page, "Pro")).not.toBeChecked()
      await enter(page, tab)
      await expect(page.getByRole("textbox", { name: "Email" })).toBeFocused()
    },
  )

  test("clicking a radio in a disabled group doesn't focus it", async ({ page, open }) => {
    await open("forms", { disabled: "" })
    await radio(page, "Pro").click({ force: true })
    await expect(radio(page, "Pro")).not.toBeFocused()
  })

  test("clicking the label of a radio in a disabled group neither focuses nor checks it", async ({
    page,
    open,
  }) => {
    await open("forms", { disabled: "" })
    await page.locator("label", { has: radio(page, "Pro") }).click({ force: true })
    await expect(radio(page, "Pro")).not.toBeFocused()
    await expect(radio(page, "Pro")).not.toBeChecked()
  })
})

test.describe("animation", () => {
  test("the indicator animates in from its starting style", async ({ page, open }) => {
    await open("forms", { animate: "" })
    await slowTransitions(page)
    await radio(page, "Pro").click()
    const indicator = radio(page, "Pro").locator(".radio-indicator")
    await expect(indicator).toHaveCount(1)
    const scale = await indicator.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a)
    expect(scale).toBeLessThan(0.5)
  })
})
