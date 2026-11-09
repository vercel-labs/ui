import type { Page } from "@playwright/test"
import { changeItems, expect, test } from "../fixtures"
import { changedItems } from "../fixtures/autocomplete"

// Suggestions that change while the list is open, like results streamed in or
// sorted by the app. The list follows its items at once: the order on screen
// is the order the arrow keys move through, the highlight stays on its item
// while that item stays in the list, and the text stays what was typed.
// The tests where the highlight stays on its item as items move are tagged
// @enhancement.

const input = (page: Page) => page.getByRole("combobox", { name: "Fruit" })
const listbox = (page: Page) => page.getByRole("listbox")
const option = (page: Page, name: string) =>
  page.getByRole("option", { name, exact: true })
const options = (page: Page) => listbox(page).getByRole("option")
const labels = (items: { label: string }[]) => items.map((item) => item.label)

// The label of the option `aria-activedescendant` points at, `undefined` when
// it points at no element, and `null` when nothing is highlighted.
async function highlighted(page: Page) {
  const id = await input(page).getAttribute("aria-activedescendant")
  if (!id) {
    return null
  }
  return page.evaluate(
    (id) => document.getElementById(id)?.textContent?.trim(),
    id
  )
}

async function openAll(page: Page) {
  await page.getByRole("button", { name: "Show fruits" }).click()
  await expect(listbox(page)).toBeVisible()
}

async function expectOrder(page: Page, expected: string[]) {
  await expect(options(page)).toHaveText(expected, { useInnerText: true })
}

test.describe("items that change while open", () => {
  test.beforeEach(async ({ open }) => {
    await open("autocomplete")
  })

  test(
    "reordered items show in their new order, and the arrow keys follow it",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openAll(page)
      await input(page).press("ArrowDown")
      await input(page).press("ArrowDown")
      await expect.poll(() => highlighted(page)).toBe("Apricot")
      await changeItems(page, "reversed")
      await expectOrder(page, labels(changedItems.reversed))
      await expect(listbox(page)).toBeVisible()
      await expect.poll(() => highlighted(page)).toBe("Apricot")
      await page.keyboard.press("ArrowDown")
      await expect.poll(() => highlighted(page)).toBe("Apple")
      await page.keyboard.press("ArrowUp")
      await page.keyboard.press("ArrowUp")
      await expect.poll(() => highlighted(page)).toBe("Avocado")
      await expect(input(page)).toBeFocused()
    }
  )

  test(
    "replaced items keep the highlight on an item that stays",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openAll(page)
      for (const name of ["Apple", "Apricot", "Avocado", "Banana"]) {
        await input(page).press("ArrowDown")
        await expect.poll(() => highlighted(page)).toBe(name)
      }
      await changeItems(page, "replaced")
      await expectOrder(page, labels(changedItems.replaced))
      await expect(listbox(page)).toBeVisible()
      await expect.poll(() => highlighted(page)).toBe("Banana")
      await page.keyboard.press("ArrowDown")
      await expect.poll(() => highlighted(page)).toBe("Kiwi")
      await page.keyboard.press("ArrowUp")
      await page.keyboard.press("ArrowUp")
      await expect.poll(() => highlighted(page)).toBe("Peach")
    }
  )

  test("the typed text stays through a reorder and a replace", async ({
    page,
  }) => {
    await input(page).fill("a")
    await input(page).press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Apple")
    await changeItems(page, "reversed")
    await expect(input(page)).toHaveValue("a")
    await changeItems(page, "replaced")
    await expectOrder(page, ["Peach", "Banana", "Grape"])
    await expect(input(page)).toHaveValue("a")
    await expect(input(page)).toBeFocused()
  })

  test(
    "removing the highlighted item keeps the list open and clears the highlight",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openAll(page)
      await input(page).press("ArrowDown")
      await expect.poll(() => highlighted(page)).toBe("Apple")
      await changeItems(page, "replaced")
      await expectOrder(page, labels(changedItems.replaced))
      await expect(listbox(page)).toBeVisible()
      await expect
        .poll(() => highlighted(page), {
          message: "the highlight isn't left pointing at the removed element",
        })
        .toBeNull()
      await expect(input(page)).toBeFocused()
      await page.keyboard.press("ArrowDown")
      await expect.poll(() => highlighted(page)).toBe("Peach")
    }
  )

  test("new items show and can be chosen", async ({ page }) => {
    await openAll(page)
    await changeItems(page, "replaced")
    await expect(option(page, "Kiwi")).toBeVisible()
    await expect(option(page, "Peach")).toBeVisible()
    await option(page, "Kiwi").click()
    await expect(input(page)).toHaveValue("Kiwi")
    await expect(listbox(page)).toBeHidden()
  })

  test("the new order stays after the list closes and opens again", async ({
    page,
  }) => {
    await openAll(page)
    await changeItems(page, "reversed")
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await openAll(page)
    await expectOrder(page, labels(changedItems.reversed))
    await input(page).press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Mango")
  })

  test(
    "a reorder keeps the suggestions that match the text, in the new order",
    { tag: "@enhancement" },
    async ({ page }) => {
      await input(page).fill("b")
      await expectOrder(page, ["Banana", "Blackberry", "Blueberry"])
      await input(page).press("ArrowDown")
      await expect.poll(() => highlighted(page)).toBe("Banana")
      await changeItems(page, "reversed")
      await expectOrder(page, ["Blueberry", "Blackberry", "Banana"])
      await expect.poll(() => highlighted(page)).toBe("Banana")
      await page.keyboard.press("ArrowUp")
      await expect.poll(() => highlighted(page)).toBe("Blackberry")
      await expect(input(page)).toHaveValue("b")
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
    await open("autocomplete", { late: "" })
    await page.getByRole("button", { name: "Show fruits" }).click()
    await expect(input(page)).toHaveAttribute("aria-expanded", "true")
    await expect(page.getByRole("option")).toHaveCount(0)
    await changeItems(page, "reversed")
    await expectOrder(page, labels(changedItems.reversed))
    await input(page).press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Mango")
  })
})
