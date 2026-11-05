import type { Locator, Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// A rating is a radio group with a radio per star or half star, so keys and
// forms follow the WAI-ARIA radio group pattern and native radios:
// https://www.w3.org/WAI/ARIA/apg/patterns/radio/

const quality = (page: Page) => page.getByRole("radiogroup", { name: "Quality" })
const value = (page: Page) => page.getByRole("radiogroup", { name: "Value for money" })
const star = (group: Locator, name: string) => group.getByRole("radio", { name, exact: true })
const items = (group: Locator) => group.locator('[data-slot="rating-item"]')
const fills = (group: Locator) =>
  items(group).evaluateAll((els) =>
    els.map((el) => Number((el as HTMLElement).style.getPropertyValue("--rating-fill"))),
  )
const submitted = async (page: Page) => {
  await page.getByRole("button", { name: "Save" }).click()
  return page.getByRole("status", { name: "Submitted" }).textContent()
}

test.describe("selection", () => {
  test("the default score is checked, and the stars up to it are full", async ({ page, open }) => {
    await open("rating")
    await expect(star(quality(page), "3 stars")).toBeChecked()
    expect(await fills(quality(page))).toEqual([1, 1, 1, 0, 0])
    await expect(items(quality(page)).nth(2)).toHaveAttribute("data-checked", "")
    await expect(items(quality(page)).nth(2)).toHaveAttribute("data-filled", "")
    await expect(items(quality(page)).nth(3)).not.toHaveAttribute("data-filled", "")
  })

  test("clicking a star checks it and says why", async ({ page, open }) => {
    await open("rating")
    await star(quality(page), "4 stars").click()
    await expect(star(quality(page), "4 stars")).toBeChecked()
    expect(await lastAction(page)).toBe("4:item-press")
    expect(await fills(quality(page))).toEqual([1, 1, 1, 1, 0])
  })

  test("a half star fills half of its star", async ({ page, open }) => {
    await open("rating")
    await star(value(page), "2.5 stars").click()
    await expect(star(value(page), "2.5 stars")).toBeChecked()
    expect(await fills(value(page))).toEqual([1, 1, 0.5, 0, 0])
    await expect(items(value(page)).nth(2)).toHaveAttribute("data-partial", "")
    await expect(items(value(page)).nth(2)).toHaveAttribute("data-checked", "")
  })

  test("clicking the checked star clears a deselectable rating, and only that one", async ({
    page,
    open,
  }) => {
    await open("rating")
    await star(value(page), "2 stars").click()
    await star(value(page), "2 stars").click()
    await expect(value(page).getByRole("radio", { checked: true })).toHaveCount(0)
    await star(quality(page), "3 stars").click()
    await expect(star(quality(page), "3 stars")).toBeChecked()
  })

  test("a change can be cancelled", async ({ page, open }) => {
    await open("rating", { cancel: "4" })
    await star(quality(page), "4 stars").click()
    await expect(star(quality(page), "3 stars")).toBeChecked()
  })

  test("a controller sets the score", async ({ page, open }) => {
    await open("rating")
    await page.getByRole("button", { name: "Rate five" }).click()
    await expect(star(quality(page), "5 stars")).toBeChecked()
  })
})

test.describe("preview", () => {
  test("a pointer over a star previews its score, and leaving shows the score again", async ({
    page,
    open,
  }) => {
    await open("rating")
    await star(value(page), "3.5 stars").hover()
    expect(await fills(value(page))).toEqual([1, 1, 1, 0.5, 0])
    await expect(items(value(page)).nth(3)).toHaveAttribute("data-highlighted", "")
    await expect(items(value(page)).nth(4)).not.toHaveAttribute("data-highlighted", "")
    await page.getByRole("button", { name: "Save" }).hover()
    expect(await fills(value(page))).toEqual([0, 0, 0, 0, 0])
  })
})

test.describe("keyboard", () => {
  test("Tab lands on the checked star, and the next Tab leaves", async ({ page, open, tab }) => {
    await open("rating")
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(star(quality(page), "3 stars")).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })

  test("arrow keys change the score by a step, and stop at the ends", async ({ page, open }) => {
    await open("rating")
    await star(quality(page), "3 stars").focus()
    await page.keyboard.press("ArrowRight")
    await expect(star(quality(page), "4 stars")).toBeChecked()
    expect(await lastAction(page)).toBe("4:list-navigation")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await expect(star(quality(page), "5 stars")).toBeChecked()
    await expect(star(quality(page), "5 stars")).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await expect(star(quality(page), "4 stars")).toBeChecked()
  })

  test("Space on the checked star clears a deselectable rating", async ({ page, open }) => {
    await open("rating")
    await star(value(page), "1.5 stars").click()
    await page.keyboard.press("ArrowRight")
    await expect(star(value(page), "2 stars")).toBeChecked()
    await page.keyboard.press("Space")
    await expect(value(page).getByRole("radio", { checked: true })).toHaveCount(0)
  })
})

test.describe("read-only", () => {
  test("a read-only rating is one image, named by its label, that shows any score", async ({
    page,
    open,
  }) => {
    await open("rating")
    const average = page.getByRole("img", { name: "Average rating: 4.2 out of 5" })
    await expect(average).toBeVisible()
    await expect(average.getByRole("radio")).toHaveCount(0)
    expect(await fills(average)).toEqual([1, 1, 1, 1, 0.2])
    await expect(items(average).nth(4)).toHaveAttribute("data-partial", "")
  })
})

test.describe("forms", () => {
  test("each score submits under its rating's name", async ({ page, open }) => {
    await open("rating")
    expect(await submitted(page)).toBe("quality=3")
    await star(value(page), "2.5 stars").click()
    expect(await submitted(page)).toBe("quality=3&value=2.5")
  })

  test("a form reset returns to the default score", async ({ page, open }) => {
    await open("rating")
    await star(quality(page), "5 stars").click()
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(star(quality(page), "3 stars")).toBeChecked()
  })

  test("a disabled rating submits nothing, and its stars can't be focused or checked", async ({
    page,
    open,
    tab,
  }) => {
    await open("rating", { disabled: "" })
    await expect(quality(page)).toHaveAttribute("aria-disabled", "true")
    await star(quality(page), "5 stars").click({ force: true })
    await expect(star(quality(page), "3 stars")).toBeChecked()
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
    expect(await submitted(page)).toBe("")
  })
})
