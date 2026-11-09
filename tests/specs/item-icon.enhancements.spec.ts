import type { Locator, Page } from "@playwright/test"
import { iconsFixture as f } from "../fixtures/item-icons"
import { expect, menuNamed, test } from "../fixtures"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`. Without an icon
// part, each icon needs its own span hidden from assistive technology.

const commandList = (page: Page) => page.locator('[data-slot="command-list"]')
const scaleOf = (icon: Locator) =>
  icon.evaluate((el) => getComputedStyle(el).scale)
const menuIcon = (page: Page, name: string) =>
  page.getByRole("menuitem", { name }).locator('[data-slot="menu-item-icon"]')

async function openMenu(page: Page) {
  await page.getByRole("button", { name: f.menu.trigger }).click()
  await expect(menuNamed(page, f.menu.trigger)).toBeVisible()
}

// Development warnings the page printed, as they were printed.
function warnings(page: Page) {
  const printed: string[] = []
  page.on(
    "console",
    (message) => message.type() === "warning" && printed.push(message.text())
  )
  return printed
}

test.describe("enhancements", { tag: "@enhancement" }, () => {
  // Typeahead reads an item's text, not its icon's, so "📌Pin" is found by "p"
  // without a `label` prop.
  test("menu typeahead finds an item by its text, not its icon's", async ({
    page,
    open,
  }) => {
    await open("item-icons")
    await page.getByRole("button", { name: f.menu.trigger }).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "Settings" })).toBeFocused()
    await page.keyboard.press("p")
    await expect(page.getByRole("menuitem", { name: "Pin" })).toBeFocused()
  })

  test("menu typeahead finds an item with only an icon by its aria-label", async ({
    page,
    open,
  }) => {
    await open("item-icons")
    await page.getByRole("button", { name: f.menu.trigger }).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "Settings" })).toBeFocused()
    await page.keyboard.press("d")
    await expect(page.getByRole("menuitem", { name: "Delete" })).toBeFocused()
  })

  test("an icon part hides itself from assistive technology", async ({
    page,
    open,
  }) => {
    await open("item-icons")
    await openMenu(page)
    await expect(menuIcon(page, "Settings")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
  })

  test("items with an icon part have data-has-icon, and their list has data-has-icons", async ({
    page,
    open,
  }) => {
    await open("item-icons")
    await openMenu(page)
    await expect(menuNamed(page, f.menu.trigger)).toHaveAttribute(
      "data-has-icons",
      ""
    )
    await expect(
      page.getByRole("menuitem", { name: "Settings" })
    ).toHaveAttribute("data-has-icon", "")
    await expect(
      page.getByRole("menuitem", { name: "Plain" })
    ).not.toHaveAttribute("data-has-icon")
    await expect(
      page.getByRole("tablist", { name: f.tabs.label })
    ).toHaveAttribute("data-has-icons", "")
    await expect(page.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "data-has-icon",
      ""
    )
    await expect(
      page.getByRole("group", { name: f.toggles.label })
    ).toHaveAttribute("data-has-icons", "")
    await expect(page.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "data-has-icon",
      ""
    )
    await expect(page.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "data-has-icon",
      ""
    )
    await expect(commandList(page)).toHaveAttribute("data-has-icons", "")
    await expect(
      commandList(page).getByRole("option", { name: "Plain" })
    ).not.toHaveAttribute("data-has-icon")
  })

  test("a list keeps data-has-icons while a search hides its items with icons", async ({
    page,
    open,
  }) => {
    await open("item-icons")
    await page.getByRole("combobox", { name: f.command.label }).fill("pla")
    await expect(commandList(page).getByRole("option")).toHaveCount(1)
    // Filtered items stay in the page, hidden, so the items left keep their place.
    await expect(commandList(page)).toHaveAttribute("data-has-icons", "")
  })

  test("a select's trigger shows the chosen option's icon beside its text", async ({
    page,
    open,
  }) => {
    await open("item-icons")
    const trigger = page.getByRole("combobox", { name: f.select.label })
    const valueIcon = page.locator('[data-slot="select-value-icon"]')
    await expect(valueIcon).toBeHidden()
    await trigger.click()
    await page.getByRole("option", { name: "Apple" }).click()
    await expect(page.locator('[data-slot="select-value"]')).toHaveText("Apple")
    await expect(valueIcon).toHaveText("🍎")
    await expect(valueIcon).toHaveAttribute("aria-hidden", "true")
    await trigger.click()
    await page.getByRole("option", { name: "Cherry" }).click()
    await expect(valueIcon.locator("title")).toHaveText("Berry")
    await trigger.click()
    await page.getByRole("option", { name: "Date" }).click()
    await expect(valueIcon).toBeHidden()
  })

  test("a select and a combobox with a value show its icon before their lists ever open", async ({
    page,
    open,
  }) => {
    await open("item-icons", { selected: "" })
    await expect(page.locator('[data-slot="select-value"]')).toHaveText("Apple")
    await expect(page.locator('[data-slot="select-value-icon"]')).toHaveText(
      "🍎"
    )
    await expect(page.locator('[data-slot="combobox-value-icon"]')).toHaveText(
      "🇫🇷"
    )
    await expect(
      page.getByRole("combobox", { name: f.combobox.label })
    ).toHaveValue("France")
  })

  test("a combobox's value icon shows the chosen item's icon", async ({
    page,
    open,
  }) => {
    await open("item-icons")
    await page.getByRole("combobox", { name: f.combobox.label }).fill("fr")
    await page.getByRole("option", { name: "France" }).click()
    await expect(page.locator('[data-slot="combobox-value-icon"]')).toHaveText(
      "🇫🇷"
    )
  })

  test("search marks skip icons", async ({ page, open }) => {
    await open("item-icons")
    await page.getByRole("combobox", { name: f.combobox.label }).fill("fr")
    await expect(
      page.getByRole("option", { name: "France" }).locator("mark")
    ).toHaveText("Fr")
    await page.getByRole("combobox", { name: f.command.label }).fill("pro")
    await expect(
      commandList(page).getByRole("option", { name: "Profile" }).locator("mark")
    ).toHaveText("Pro")
  })

  test("mirrored icons flip in right-to-left text only, and others never", async ({
    page,
    open,
  }) => {
    await open("item-icons")
    await openMenu(page)
    await expect(menuIcon(page, "Forward")).toHaveAttribute("data-mirror", "")
    expect(await scaleOf(menuIcon(page, "Forward"))).toBe("none")
    await open("item-icons", { dir: "rtl" })
    await openMenu(page)
    expect(await scaleOf(menuIcon(page, "Forward"))).toBe("-1 1")
    expect(await scaleOf(menuIcon(page, "Settings"))).toBe("none")
    const link = page
      .getByRole("link", { name: "Next" })
      .locator('[data-slot="navigation-menu-link-icon"]')
    expect(await scaleOf(link)).toBe("-1 1")
  })

  test("an item with only an icon and no name warns, naming the component and its id", async ({
    page,
    open,
  }) => {
    const printed = warnings(page)
    await open("item-icons", { unnamed: "" })
    await openMenu(page)
    await expect
      .poll(() => printed.find((text) => text.includes("only an icon")))
      .toMatch(
        /^\[ui-sdk\] menu#\S+: An item with only an icon has no accessible name\./
      )
  })
})
