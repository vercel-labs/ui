import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// Web components that render parts from data copy the same parts written in a
// <template> inside them, with their classes and content. Items copy deeply,
// so an indicator in the template's item comes along, and the label goes in
// the item's text part when it has one.

test.beforeEach(async ({ framework, open }) => {
  test.skip(
    !framework.startsWith("web"),
    "Only web components render parts from a template."
  )
  await open("web-templates")
})

test.describe("select", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("combobox", { name: "Plan" }).click()
  })

  test("the content copies the template's content", async ({ page }) => {
    await expect(page.getByRole("listbox", { name: "Plan" })).toHaveClass(
      /\bplan-content\b/
    )
  })

  test("items copy the template's item, with its indicator", async ({
    page,
  }) => {
    const item = page.getByRole("option", { name: "Free" })
    await expect(item).toHaveClass(/\bplan-item\b/)
    await expect(item.locator(".plan-indicator")).toHaveText("✓")
  })

  test("an item's label goes in its text part", async ({ page }) => {
    await expect(
      page.getByRole("option", { name: "Pro" }).locator(".plan-text")
    ).toHaveText("Pro")
  })
})

test.describe("combobox chips", () => {
  const chips = (page: Page) => page.locator('[data-slot="combobox-chip"]')

  test("each chip copies the template's chip", async ({ page }) => {
    await expect(chips(page)).toHaveText([/Red/, /Blue/])
    await expect(chips(page).first()).toHaveClass(/\bcolor-chip\b/)
  })

  test("a chip keeps the template's remove button, named after its value", async ({
    page,
  }) => {
    await expect(page.getByRole("button", { name: "Remove Red" })).toHaveClass(
      /\bcolor-chip-remove\b/
    )
    await page.getByRole("button", { name: "Remove Red" }).click()
    await expect(chips(page)).toHaveText([/Blue/])
  })
})

test.describe("menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("button", { name: "View" }).click()
  })

  test("the content copies the template's content", async ({ page }) => {
    await expect(page.getByRole("menu", { name: "View" })).toHaveClass(
      /\bview-content\b/
    )
  })

  test("a checkbox item copies the template's, with its indicator", async ({
    page,
  }) => {
    const item = page.getByRole("menuitemcheckbox", { name: "Ruler" })
    await expect(item).toHaveClass(/\bview-checkbox\b/)
    await expect(item.locator(".view-check")).toHaveText("✓")
  })

  test("a radio item copies the template's, with its indicator", async ({
    page,
  }) => {
    const item = page.getByRole("menuitemradio", { name: "Fit" })
    await expect(item).toHaveClass(/\bview-radio\b/)
    await expect(item.locator(".view-dot")).toHaveText("•")
  })

  test("a submenu trigger copies the template's, with its chevron after the label", async ({
    page,
  }) => {
    const trigger = page.getByRole("menuitem", { name: "Panels" })
    await expect(trigger).toHaveClass(/\bview-sub-trigger\b/)
    await expect(trigger).toHaveText("Panels›")
    await trigger.click()
    await expect(page.getByRole("menu", { name: "Panels" })).toHaveClass(
      /\bview-sub-content\b/
    )
  })
})

test.describe("tree", () => {
  test("items copy the template's item and label", async ({ page }) => {
    const item = page.getByRole("treeitem", { name: "Theming" })
    await expect(item).toHaveClass(/\bdocs-item\b/)
    await expect(item.locator(".docs-label")).toHaveText("Theming")
  })

  test("only branches copy the template's indicator", async ({ page }) => {
    await expect(
      page
        .getByRole("treeitem", { name: "Guides" })
        .locator(".docs-indicator")
        .first()
    ).toHaveText("›")
    await expect(
      page.getByRole("treeitem", { name: "Theming" }).locator(".docs-indicator")
    ).toHaveCount(0)
  })

  test("a group copies the template's group", async ({ page }) => {
    await expect(page.getByRole("tree").getByRole("group")).toHaveClass(
      /\bdocs-group\b/
    )
  })

  test("a link item's label is a link with the label's classes", async ({
    page,
  }) => {
    const link = page.getByRole("tree").locator('a[href="#install"]')
    await expect(link).toHaveText("Install")
    await expect(link).toHaveClass(/\bdocs-label\b/)
  })
})

test.describe("toast", () => {
  test("an empty close button shows the toast's cancel label and runs it", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Toast with cancel" }).click()
    const cancel = page.getByRole("button", { name: "Undo" })
    await expect(cancel).toHaveClass(/\btoast-cancel\b/)
    await cancel.click()
    expect(await lastAction(page)).toBe("cancel")
    await expect(page.locator(".toast")).toHaveCount(0)
  })

  test("an empty close button hides when the toast has no cancel", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Toast without cancel" }).click()
    const toast = page.locator(".toast", { hasText: "Draft saved" })
    await expect(toast).toBeVisible()
    await expect(toast.locator(".toast-cancel")).toBeHidden()
  })

  test("an overlay host renders its toasts from its template", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Toast from the host" }).click()
    await expect(page.locator(".host-toast .host-toast-title")).toHaveText(
      "Synced"
    )
  })
})
