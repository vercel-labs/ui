import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// A segmented control is a radio group drawn as buttons, so keys and forms
// follow the WAI-ARIA radio group pattern and native radios:
// https://www.w3.org/WAI/ARIA/apg/patterns/radio/

const control = (page: Page) => page.getByRole("radiogroup", { name: "View" })
const item = (page: Page, name: string) =>
  page.getByRole("radio", { name, exact: true })
const indicator = (page: Page) =>
  page.locator('[data-slot="segmented-control-indicator"]')
const submitted = async (page: Page) => {
  await page.getByRole("button", { name: "Save" }).click()
  return page.getByRole("status", { name: "Submitted" }).textContent()
}

// The indicator is presentational, so it has no role to find it by.
async function coversItem(page: Page, name: string) {
  const box = await indicator(page).boundingBox()
  const target = await item(page, name).boundingBox()
  if (!box || !target) {
    return false
  }
  return (["x", "y", "width", "height"] as const).every(
    (key) => Math.abs(box[key] - target[key]) <= 1
  )
}

// Read from the variables, since the indicator's own box may be rounded.
function indicatorMisfit(page: Page, name: string) {
  return item(page, name).evaluate((el) => {
    const root = el.closest<HTMLElement>('[data-slot="segmented-control"]')!
    const box = root.querySelector<HTMLElement>(
      '[data-slot="segmented-control-indicator"]'
    )!
    const read = (edge: string) =>
      parseFloat(
        box.style.getPropertyValue(`--segmented-control-indicator-${edge}`)
      )
    const rootRect = root.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const scale = rootRect.width / root.offsetWidth
    const start = (rect.left - rootRect.left) / scale - root.clientLeft
    const end = (rect.right - rootRect.left) / scale - root.clientLeft
    return Math.max(
      Math.abs(read("left") - start),
      Math.abs(read("left") + read("width") - end)
    )
  })
}

// Four 47.5px columns put the last item at 154.5px, which offsetLeft rounds.
function fractionalColumns(page: Page) {
  return control(page).evaluate((el) => {
    Object.assign(el.style, {
      display: "grid",
      gridTemplateColumns: "repeat(4, 47.5px)",
      gap: "4px",
      padding: "0",
    })
  })
}

test.describe("selection", () => {
  test("the default item is checked, and only that one", async ({
    page,
    open,
  }) => {
    await open("segmented-control")
    await expect(item(page, "List")).toBeChecked()
    for (const name of ["Grid", "Board", "Calendar"]) {
      await expect(item(page, name)).not.toBeChecked()
    }
  })

  test("clicking an item checks it and says why", async ({ page, open }) => {
    await open("segmented-control")
    await item(page, "Grid").click()
    await expect(item(page, "Grid")).toBeChecked()
    await expect(item(page, "List")).not.toBeChecked()
    expect(await lastAction(page)).toBe("grid:item-press")
  })

  test("clicking a disabled item does nothing", async ({ page, open }) => {
    await open("segmented-control")
    await item(page, "Board").click({ force: true })
    await expect(item(page, "List")).toBeChecked()
    expect(await lastAction(page)).toBe("")
  })

  test("a change can be cancelled", async ({ page, open }) => {
    await open("segmented-control", { cancel: "grid" })
    await item(page, "Grid").click()
    await expect(item(page, "List")).toBeChecked()
  })

  test("a controller checks an item", async ({ page, open }) => {
    await open("segmented-control")
    await page.getByRole("button", { name: "Show calendar" }).click()
    await expect(item(page, "Calendar")).toBeChecked()
  })
})

test.describe("keyboard", () => {
  test("Tab lands on the checked item, and the next Tab leaves", async ({
    page,
    open,
    tab,
  }) => {
    await open("segmented-control", { default: "grid" })
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(item(page, "Grid")).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })

  test("arrow keys on both axes check the next item, skip disabled ones and wrap", async ({
    page,
    open,
  }) => {
    await open("segmented-control")
    await item(page, "List").focus()
    await page.keyboard.press("ArrowRight")
    await expect(item(page, "Grid")).toBeChecked()
    expect(await lastAction(page)).toBe("grid:list-navigation")
    await page.keyboard.press("ArrowDown")
    await expect(item(page, "Calendar")).toBeChecked()
    await expect(item(page, "Calendar")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(item(page, "List")).toBeChecked()
    await page.keyboard.press("ArrowUp")
    await expect(item(page, "Calendar")).toBeChecked()
  })
})

test.describe("orientation", () => {
  test("a segmented control is horizontal unless it says otherwise", async ({
    page,
    open,
  }) => {
    await open("segmented-control")
    await expect(control(page)).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    )
    await expect(control(page)).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
    await expect(indicator(page)).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
  })

  test("a vertical segmented control reports it", async ({ page, open }) => {
    await open("segmented-control", { orientation: "vertical" })
    await expect(control(page)).toHaveAttribute("aria-orientation", "vertical")
    await expect(indicator(page)).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })
})

test.describe("indicator", () => {
  test("the indicator covers the checked item", async ({ page, open }) => {
    await open("segmented-control")
    await expect.poll(() => coversItem(page, "List")).toBe(true)
  })

  test("the indicator follows the checked item", async ({ page, open }) => {
    await open("segmented-control")
    await item(page, "Calendar").click()
    await expect.poll(() => coversItem(page, "Calendar")).toBe(true)
  })

  test("the indicator covers the checked item in a vertical control", async ({
    page,
    open,
  }) => {
    await open("segmented-control", { orientation: "vertical" })
    await item(page, "Grid").click()
    await expect.poll(() => coversItem(page, "Grid")).toBe(true)
  })

  test("the indicator matches items with fractional widths exactly", async ({
    page,
    open,
  }) => {
    await open("segmented-control")
    await fractionalColumns(page)
    await item(page, "Calendar").click()
    await expect
      .poll(() => indicatorMisfit(page, "Calendar"))
      .toBeLessThan(0.01)
  })

  test("a scaled ancestor doesn't move the indicator off fractional items", async ({
    page,
    open,
  }) => {
    await open("segmented-control")
    await fractionalColumns(page)
    await control(page).evaluate((el) => {
      el.parentElement!.style.transform = "scale(0.5)"
    })
    await item(page, "Calendar").click()
    await expect
      .poll(() => indicatorMisfit(page, "Calendar"))
      .toBeLessThan(0.01)
  })

  test("with nothing checked, the indicator has no box", async ({
    page,
    open,
  }) => {
    await open("segmented-control", { default: "none" })
    await expect(item(page, "List")).not.toBeChecked()
    await expect
      .poll(() =>
        indicator(page).evaluate((el) =>
          el.style.getPropertyValue("--segmented-control-indicator-width")
        )
      )
      .toBe("")
    await item(page, "Grid").click()
    await expect.poll(() => coversItem(page, "Grid")).toBe(true)
  })
})

test.describe("forms", () => {
  test("the checked value submits under the control's name", async ({
    page,
    open,
  }) => {
    await open("segmented-control")
    await item(page, "Grid").click()
    expect(await submitted(page)).toBe("view=grid")
  })

  test("a form reset checks the default item again", async ({ page, open }) => {
    await open("segmented-control")
    await item(page, "Calendar").click()
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(item(page, "List")).toBeChecked()
  })

  test("a disabled control submits nothing, and its items can't be focused or checked", async ({
    page,
    open,
    tab,
  }) => {
    await open("segmented-control", { disabled: "" })
    await expect(control(page)).toHaveAttribute("aria-disabled", "true")
    await item(page, "Grid").click({ force: true })
    await expect(item(page, "List")).toBeChecked()
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
    expect(await submitted(page)).toBe("")
  })
})
