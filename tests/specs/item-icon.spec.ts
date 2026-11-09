import type { Page } from "@playwright/test"
import { iconsFixture as f } from "../fixtures/item-icons"
import { expect, lastAction, menuNamed, test } from "../fixtures"

// Icons inside items hold text, an SVG <title> or an emoji, that must never
// reach an item's name, its label, typeahead or a search. The fixture's icons
// are titled "Gear", "Berry", "Flag" and so on, so a leak shows as a name like
// "Gear Settings", or a search for "gear" that finds Settings.

// The command's list, which nothing names.
const commandList = (page: Page) => page.locator('[data-slot="command-list"]')

// Development warnings the page printed, as they were printed.
function warnings(page: Page) {
  const printed: string[] = []
  page.on(
    "console",
    (message) => message.type() === "warning" && printed.push(message.text())
  )
  return printed
}

async function openMenu(page: Page) {
  await page.getByRole("button", { name: f.menu.trigger }).click()
  await expect(menuNamed(page, f.menu.trigger)).toBeVisible()
}

test.describe("item icons", () => {
  test.beforeEach(async ({ open }) => {
    await open("item-icons")
  })

  test("a menu item's name leaves out its icon's SVG title and emoji", async ({
    page,
  }) => {
    await openMenu(page)
    for (const item of [...f.menu.items, f.menu.iconOnly]) {
      await expect(
        page.getByRole("menuitem", { name: item.label, exact: true })
      ).toBeVisible()
    }
  })

  test("icons are no images in the accessibility tree", async ({ page }) => {
    await openMenu(page)
    await expect(page.getByRole("menuitem", { name: "Settings" })).toBeVisible()
    await expect(page.getByRole("img")).toHaveCount(0)
  })

  test("choosing a menu item with an icon reports it", async ({ page }) => {
    await openMenu(page)
    await page.getByRole("menuitem", { name: "Pin" }).click()
    await expect.poll(() => lastAction(page)).toBe("menu:pin")
  })

  test("a select's options are named by their text, not their icons", async ({
    page,
  }) => {
    await page.getByRole("combobox", { name: f.select.label }).click()
    for (const item of f.select.items) {
      await expect(
        page.getByRole("option", { name: item.label, exact: true })
      ).toBeVisible()
    }
  })

  test("typing on a select's trigger picks an option by its text, not its icon's", async ({
    page,
  }) => {
    await page.getByRole("combobox", { name: f.select.label }).focus()
    await page.keyboard.press("c")
    await expect(page.locator(".value")).toHaveText("Cherry")
  })

  test("a combobox's search skips its items' icons", async ({ page }) => {
    const input = page.getByRole("combobox", { name: f.combobox.label })
    await input.fill("fr")
    await expect(
      page.getByRole("option", { name: "France", exact: true })
    ).toBeVisible()
    await expect(page.getByRole("option", { name: "Chile" })).toHaveCount(0)
    await input.fill("fla")
    await expect(page.getByRole("option", { name: "France" })).toHaveCount(0)
    await expect(page.getByRole("option", { name: "Chile" })).toHaveCount(0)
  })

  test("choosing a combobox item writes its text, without its icon's", async ({
    page,
  }) => {
    const input = page.getByRole("combobox", { name: f.combobox.label })
    await input.fill("fr")
    await page.getByRole("option", { name: "France" }).click()
    await expect(input).toHaveValue("France")
  })

  test("an autocomplete's search skips its suggestions' icons", async ({
    page,
  }) => {
    const input = page.getByRole("combobox", { name: f.autocomplete.label })
    await input.fill("pref")
    await expect(
      page.getByRole("option", { name: "Preferences", exact: true })
    ).toBeVisible()
    await input.fill("gear")
    await expect(page.getByRole("option", { name: "Preferences" })).toHaveCount(
      0
    )
  })

  test("choosing a suggestion fills in its text alone, without its icon or the markup's line breaks", async ({
    page,
  }) => {
    const input = page.getByRole("combobox", { name: f.autocomplete.label })
    await input.fill("pref")
    await page.getByRole("option", { name: "Preferences" }).click()
    await expect(input).toHaveValue("Preferences")
  })

  test("a command's search skips its commands' icons", async ({ page }) => {
    const input = page.getByRole("combobox", { name: f.command.label })
    const list = commandList(page)
    await input.fill("pro")
    await expect(
      list.getByRole("option", { name: "Profile", exact: true })
    ).toBeVisible()
    await input.fill("gear")
    await expect(list.getByRole("option")).toHaveCount(0)
  })

  test("tabs, toggles and links are named by their text or aria-label, never their icons", async ({
    page,
  }) => {
    for (const tab of [...f.tabs.tabs, f.tabs.iconOnly]) {
      await expect(
        page.getByRole("tab", { name: tab.label, exact: true })
      ).toBeVisible()
    }
    for (const toggle of [f.toggles.bold, f.toggles.iconOnly]) {
      await expect(
        page.getByRole("button", { name: toggle.label, exact: true })
      ).toBeVisible()
    }
    for (const link of f.navigation.links) {
      await expect(
        page.getByRole("link", { name: link.label, exact: true })
      ).toBeVisible()
    }
  })

  test("suggestions with text that mount filtered out don't warn about having only an icon", async ({
    page,
    open,
  }) => {
    const printed = warnings(page)
    await open("item-icons")
    await page
      .getByRole("combobox", { name: f.autocomplete.label })
      .fill("pref")
    await expect(
      page.getByRole("option", { name: "Preferences", exact: true })
    ).toBeVisible()
    // Warnings come a task after the items bind.
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 50)))
    expect(printed.filter((text) => text.includes("only an icon"))).toEqual([])
  })

  test("an item with only an icon and an aria-label doesn't warn", async ({
    page,
    open,
  }) => {
    const printed = warnings(page)
    await open("item-icons")
    await openMenu(page)
    await expect(page.getByRole("menuitem", { name: "Delete" })).toBeVisible()
    // Warnings come a microtask after the items bind.
    await page.evaluate(() => new Promise(requestAnimationFrame))
    expect(printed.filter((text) => text.includes("only an icon"))).toEqual([])
  })
})
