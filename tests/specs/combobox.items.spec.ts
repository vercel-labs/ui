import type { Page } from "@playwright/test"
import { changeItems, expect, lastAction, test } from "../fixtures"
import { changedItems } from "../fixtures/combobox"

// Items that change while the list is open, like options streamed in or
// sorted by the app. The list follows its items at once: the order on screen
// is the order the keys move through, and the selection and the highlight
// stay on their items while those items stay in the list. Focus stays in the
// input, and aria-activedescendant points at the highlighted option.
// The tests where the highlight stays on its item as items move are tagged
// @enhancement.

const input = (page: Page) => page.getByRole("combobox", { name: "Country" })
const listbox = (page: Page) => page.getByRole("listbox")
const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })

async function highlighted(page: Page) {
  const id = await input(page).getAttribute("aria-activedescendant")
  if (!id) {
    return null
  }
  return page.evaluate(
    (id) => document.getElementById(id)?.textContent?.replace("✓", "").trim(),
    id
  )
}

// Whether aria-activedescendant names nothing, or an element on the page.
async function pointsAtNothingMissing(page: Page) {
  const id = await input(page).getAttribute("aria-activedescendant")
  return !id || page.evaluate((id) => document.getElementById(id) !== null, id)
}

// The options in the order the page shows them. An item's text may hold its check.
async function expectOrder(page: Page, labels: string[]) {
  await expect(listbox(page).getByRole("option")).toHaveText(
    labels.map((label) => new RegExp(`^✓?\\s*${label}\\s*✓?$`))
  )
}

async function openList(page: Page) {
  await input(page).focus()
  await page.keyboard.press("ArrowDown")
  await expect(listbox(page)).toBeVisible()
}

// Presses ArrowDown until the item is highlighted. Opening may highlight the
// first item or the selected one, so specs don't rely on where it starts.
async function highlight(page: Page, label: string) {
  for (
    let presses = 0;
    presses < 12 && (await highlighted(page)) !== label;
    presses++
  ) {
    await page.keyboard.press("ArrowDown")
    await page.evaluate(() => new Promise(requestAnimationFrame))
  }
  expect(await highlighted(page)).toBe(label)
}

const labels = (items: { label: string }[]) => items.map((item) => item.label)

test.describe("items that change while open", () => {
  test.beforeEach(async ({ open }) => {
    await open("combobox", { value: "fr" })
  })

  test(
    "reordered items show in their new order, and the arrow keys follow it",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openList(page)
      await highlight(page, "Australia")
      await changeItems(page, "reversed")
      await expectOrder(page, labels(changedItems.reversed))
      await expect(listbox(page)).toBeVisible()
      await expect.poll(() => highlighted(page)).toBe("Australia")
      await page.keyboard.press("ArrowDown")
      await expect.poll(() => highlighted(page)).toBe("Argentina")
      await page.keyboard.press("ArrowUp")
      await page.keyboard.press("ArrowUp")
      await expect.poll(() => highlighted(page)).toBe("Austria")
      await expect(input(page)).toBeFocused()
    }
  )

  test(
    "the highlight and the selected value stay on their items after a reorder",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openList(page)
      await highlight(page, "Brazil")
      await changeItems(page, "reversed")
      await expectOrder(page, labels(changedItems.reversed))
      await expect.poll(() => highlighted(page)).toBe("Brazil")
      await expect(option(page, "Brazil")).toHaveAttribute(
        "data-highlighted",
        ""
      )
      await expect(option(page, "France")).toHaveAttribute(
        "aria-selected",
        "true"
      )
      await expect(input(page)).toHaveValue("France")
    }
  )

  test(
    "the highlight and the selected value stay on their items after a replace",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openList(page)
      await highlight(page, "Brazil")
      await changeItems(page, "replaced")
      await expectOrder(page, labels(changedItems.replaced))
      await expect(listbox(page)).toBeVisible()
      await expect.poll(() => highlighted(page)).toBe("Brazil")
      await expect(option(page, "France")).toHaveAttribute(
        "aria-selected",
        "true"
      )
      await page.keyboard.press("ArrowUp")
      await expect.poll(() => highlighted(page)).toBe("Italy")
      await page.keyboard.press("ArrowUp")
      await expect.poll(() => highlighted(page)).toBe("France")
      await expect(input(page)).toHaveValue("France")
    }
  )

  test("removing the highlighted item keeps the list open, pointing at no missing option", async ({
    page,
  }) => {
    await openList(page)
    await highlight(page, "Australia")
    await changeItems(page, "replaced")
    await expectOrder(page, labels(changedItems.replaced))
    await expect(listbox(page)).toBeVisible()
    await expect(input(page)).toBeFocused()
    await expect.poll(() => pointsAtNothingMissing(page)).toBe(true)
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await expect(input(page)).toHaveValue("France")
  })

  test(
    "removing the highlighted item clears the highlight, so the keys start over",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openList(page)
      await highlight(page, "Australia")
      await changeItems(page, "replaced")
      await expectOrder(page, labels(changedItems.replaced))
      await expect.poll(() => highlighted(page)).toBeNull()
      await page.keyboard.press("ArrowDown")
      await expect.poll(() => highlighted(page)).toBe("Spain")
    }
  )

  test("new items can be reached and chosen", async ({ page }) => {
    await openList(page)
    await changeItems(page, "replaced")
    await expect(option(page, "Spain")).toBeVisible()
    await expect(option(page, "Italy")).toBeVisible()
    await highlight(page, "Italy")
    await page.keyboard.press("Enter")
    await expect(listbox(page)).toBeHidden()
    await expect(input(page)).toHaveValue("Italy")
    expect(await lastAction(page)).toBe("value:it")
  })

  test("the new order stays after the list closes and opens again", async ({
    page,
  }) => {
    await openList(page)
    await changeItems(page, "reversed")
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await page.keyboard.press("ArrowDown")
    await expect(listbox(page)).toBeVisible()
    await expectOrder(page, labels(changedItems.reversed))
    await highlight(page, "Chile")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Canada")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Brazil")
  })

  test("a reorder keeps the filtered results, in the new order", async ({
    page,
  }) => {
    await input(page).fill("an")
    await expectOrder(page, ["Canada", "France", "Germany"])
    await changeItems(page, "reversed")
    await expectOrder(page, ["Germany", "France", "Canada"])
    await expect(input(page)).toHaveValue("an")
    await highlight(page, "France")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Canada")
  })

  test(
    "the highlight stays on its item when filtered results are reordered",
    { tag: "@enhancement" },
    async ({ page }) => {
      await input(page).fill("an")
      await highlight(page, "Canada")
      await changeItems(page, "reversed")
      await expectOrder(page, ["Germany", "France", "Canada"])
      await expect.poll(() => highlighted(page)).toBe("Canada")
      await page.keyboard.press("ArrowUp")
      await expect.poll(() => highlighted(page)).toBe("France")
    }
  )
})

test.describe("items that arrive while open", () => {
  test("a content with no children renders items that arrive while it's open", async ({
    page,
    open,
    framework,
  }) => {
    test.skip(
      !framework.startsWith("react"),
      "The ?late fixture is React only."
    )
    await open("combobox", { late: "" })
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(input(page)).toHaveAttribute("aria-expanded", "true")
    await expect(page.getByRole("option")).toHaveCount(0)
    await changeItems(page, "reversed")
    await expectOrder(page, labels(changedItems.reversed))
    await highlight(page, "Germany")
    await page.keyboard.press("Enter")
    await expect.poll(() => lastAction(page)).toBe("value:de")
  })
})
