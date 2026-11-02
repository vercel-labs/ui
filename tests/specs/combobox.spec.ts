import type { Page } from "@playwright/test"
import { expect, isSheet, lastAction, test, waitForStill } from "../fixtures"

// An editable combobox with a listbox popup and list autocomplete, following
// the WAI-ARIA APG pattern https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
// Focus stays in the input, and aria-activedescendant points at the highlighted option.

const input = (page: Page) => page.getByRole("combobox", { name: "Country" })
// The list is found by role.
const listbox = (page: Page) => page.getByRole("listbox")
const option = (page: Page, name: string) => page.getByRole("option", { name, exact: true })
const options = (page: Page) => listbox(page).getByRole("option")

async function highlighted(page: Page) {
  const id = await input(page).getAttribute("aria-activedescendant")
  if (!id) return null
  return page.evaluate((id) => document.getElementById(id)?.textContent?.replace("✓", "").trim(), id)
}

test.describe("input", () => {
  test.beforeEach(async ({ open }) => {
    await open("combobox")
  })

  test("is a combobox named by its label, with list autocomplete", async ({ page }) => {
    await expect(input(page)).toHaveAttribute("aria-autocomplete", "list")
    await expect(input(page)).toHaveAttribute("aria-expanded", "false")
  })

  test("typing opens the list with the items that match", async ({ page }) => {
    await input(page).fill("bra")
    await expect(listbox(page)).toBeVisible()
    await expect(options(page)).toHaveText(["Brazil"], { useInnerText: true })
    await expect(input(page)).toHaveAttribute("aria-expanded", "true")
  })

  test("matching ignores case and accents", async ({ page }) => {
    await input(page).fill("FRÁ")
    await expect(options(page)).toHaveText(["France"], { useInnerText: true })
  })

  test("ArrowDown opens the list", async ({ page }) => {
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(listbox(page)).toBeVisible()
    await expect(options(page)).toHaveCount(10)
  })

  test("choosing with the keyboard leaves the caret after the text", async ({ page }) => {
    await input(page).focus()
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("Enter")
    await expect(input(page)).toHaveValue("Germany")
    await page.keyboard.type("!")
    await expect(input(page)).toHaveValue("Germany!")
  })

  test("points to the list it controls while open", async ({ page }) => {
    await input(page).fill("a")
    const id = await listbox(page).getAttribute("id")
    await expect(input(page)).toHaveAttribute("aria-controls", id!)
  })
})

test.describe("highlight", () => {
  test.beforeEach(async ({ open }) => {
    await open("combobox")
  })

  test("arrow keys move the highlight while focus stays in the input", async ({ page }) => {
    await input(page).fill("a")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Argentina")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Australia")
    await page.keyboard.press("ArrowUp")
    await expect.poll(() => highlighted(page)).toBe("Argentina")
    await expect(input(page)).toBeFocused()
    await expect(option(page, "Argentina")).toHaveAttribute("data-highlighted", "")
  })

  test("arrow keys skip disabled items", async ({ page }) => {
    await input(page).fill("e")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Argentina")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Chile")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("France")
    await page.keyboard.press("ArrowUp")
    await expect.poll(() => highlighted(page)).toBe("Chile")
  })

  test("moving over a disabled item leaves the highlight where it was", async ({ page }) => {
    await input(page).fill("e")
    await waitForStill(listbox(page))
    await option(page, "Chile").hover()
    await expect.poll(() => highlighted(page)).toBe("Chile")
    await option(page, "Denmark").hover({ force: true })
    await expect.poll(() => highlighted(page)).toBe("Chile")
  })

  test("the highlighted option has the id aria-activedescendant names", async ({ page }) => {
    await input(page).fill("can")
    await page.keyboard.press("ArrowDown")
    const id = await option(page, "Canada").getAttribute("id")
    await expect(input(page)).toHaveAttribute("aria-activedescendant", id!)
  })
})

test.describe("autoHighlight", () => {
  test("the first match is highlighted from the first keystroke, so Enter chooses it", async ({
    page,
    open,
  }) => {
    await open("combobox", { auto: "" })
    await input(page).focus()
    await page.keyboard.type("g")
    await expect.poll(() => highlighted(page)).toBe("Argentina")
    await page.keyboard.type("er")
    await expect.poll(() => highlighted(page)).toBe("Germany")
    await page.keyboard.press("Enter")
    await expect(input(page)).toHaveValue("Germany")
  })

  test("a disabled match is passed over", async ({ page, open }) => {
    await open("combobox", { auto: "" })
    await input(page).focus()
    await page.keyboard.type("den")
    await expect(option(page, "Denmark")).toBeVisible()
    await expect.poll(() => highlighted(page)).toBe(null)
  })
})

test.describe("choosing", () => {
  test.beforeEach(async ({ open }) => {
    await open("combobox")
  })

  test("Enter chooses the highlighted item, puts its label in the input and closes", async ({ page }) => {
    await input(page).fill("aus")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => highlighted(page)).toBe("Australia")
    await page.keyboard.press("Enter")
    await expect(listbox(page)).toBeHidden()
    await expect(input(page)).toHaveValue("Australia")
    await expect(input(page)).toBeFocused()
    expect(await lastAction(page)).toBe("value:au")
  })

  test("clicking an item chooses it and keeps focus in the input", async ({ page }) => {
    await input(page).fill("ch")
    await option(page, "Chile").click()
    await expect(input(page)).toHaveValue("Chile")
    await expect(input(page)).toBeFocused()
    await expect(listbox(page)).toBeHidden()
  })

  test("a disabled item can't be chosen", async ({ page }) => {
    await input(page).fill("den")
    // A forced press doesn't wait for a rising sheet.
    await waitForStill(listbox(page))
    await option(page, "Denmark").click({ force: true })
    await expect(input(page)).not.toHaveValue("Denmark")
    await page.keyboard.press("Escape")
    expect(await lastAction(page)).toBe("")
  })

  test("after choosing, opening again shows every item with the chosen one selected", async ({ page }) => {
    await input(page).fill("fra")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(listbox(page)).toBeHidden()
    await page.keyboard.press("ArrowDown")
    await expect(options(page)).toHaveCount(10)
    await expect(option(page, "France")).toHaveAttribute("aria-selected", "true")
  })

  test("a canceled choice closes the list and keeps the value's label in the input", async ({
    page,
    open,
  }) => {
    await open("combobox", { value: "fr", cancel: "br" })
    await input(page).fill("bra")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(listbox(page)).toBeHidden()
    await expect(input(page)).toHaveValue("France")
    expect(await lastAction(page)).toBe("")
  })

  test("text that matches nothing shows the empty message", async ({ page }) => {
    await input(page).fill("zzz")
    await expect(page.getByText("No countries found")).toBeVisible()
    await expect(options(page)).toHaveCount(0)
  })
})

test.describe("closing", () => {
  test.beforeEach(async ({ open }) => {
    await open("combobox")
  })

  test("Escape closes the list and keeps focus in the input", async ({ page }) => {
    await input(page).fill("a")
    await expect(listbox(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await expect(input(page)).toBeFocused()
  })

  test("Escape after deleting the text brings back the value and its label", async ({ page, open }) => {
    await open("combobox", { value: "fr" })
    await input(page).fill("")
    await expect(listbox(page)).toBeVisible()
    expect(await lastAction(page)).toBe("value:null")
    await page.keyboard.press("Escape")
    await expect(listbox(page)).toBeHidden()
    await expect(input(page)).toHaveValue("France")
    expect(await lastAction(page)).toBe("value:fr")
  })

  test("leaving after deleting the text keeps the value empty", async ({ page, open, tab }) => {
    await open("combobox", { value: "fr" })
    await input(page).fill("")
    await expect(listbox(page)).toBeVisible()
    await tab()
    await expect(listbox(page)).toBeHidden()
    await expect(input(page)).toHaveValue("")
    expect(await lastAction(page)).toBe("value:null")
  })

  test("clicking outside closes the list", async ({ page }) => {
    await input(page).fill("a")
    await expect(listbox(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(listbox(page)).toBeHidden()
  })

  test("Tab closes the list and moves on", async ({ page, tab }) => {
    await input(page).fill("a")
    await expect(listbox(page)).toBeVisible()
    await tab()
    await expect(listbox(page)).toBeHidden()
    await expect(input(page)).not.toBeFocused()
  })
})

test.describe("trigger and clear", () => {
  test.beforeEach(async ({ open }) => {
    await open("combobox")
  })

  test("the trigger button opens and closes the list", async ({ page, fixtureOptions }) => {
    test.skip(isSheet(fixtureOptions), "A sheet is modal by default, so the trigger behind it is inert.")
    const trigger = page.getByRole("button", { name: "Show countries", includeHidden: true })
    await trigger.click()
    await expect(listbox(page)).toBeVisible()
    await trigger.click()
    await expect(listbox(page)).toBeHidden()
  })

  test("clear empties the input and the value", async ({ page }) => {
    await input(page).fill("bel")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(input(page)).toHaveValue("Belgium")
    await page.getByRole("button", { name: "Clear" }).click()
    await expect(input(page)).toHaveValue("")
    expect(await lastAction(page)).toBe("value:null")
  })
})

test.describe("default value", () => {
  test("shows its label in the input", async ({ page, open }) => {
    await open("combobox", { value: "fr" })
    await expect(input(page)).toHaveValue("France")
  })
})

test.describe("multiple", () => {
  test.beforeEach(async ({ open }) => {
    await open("combobox", { multiple: "" })
  })

  test("choosing adds a chip and empties the input", async ({ page }) => {
    await input(page).fill("bra")
    await expect(listbox(page)).toHaveAttribute("aria-multiselectable", "true")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(page.getByRole("button", { name: "Remove Brazil", includeHidden: true })).toBeVisible()
    await expect(input(page)).toHaveValue("")
  })

  test("a canceled choice adds no chip and keeps the text", async ({ page, open }) => {
    await open("combobox", { multiple: "", cancel: "br" })
    await input(page).fill("bra")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(page.getByRole("button", { name: "Remove Brazil", includeHidden: true })).toHaveCount(0)
    await expect(input(page)).toHaveValue("bra")
    await expect(listbox(page)).toBeVisible()
  })

  test("Backspace in an empty input removes the last chip", async ({ page }) => {
    await input(page).fill("bra")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await page.keyboard.type("can")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("value:br,ca")
    await page.keyboard.press("Backspace")
    expect(await lastAction(page)).toBe("value:br")
    await expect(page.getByRole("button", { name: "Remove Canada" })).toHaveCount(0)
  })

  test("a chip's remove button removes its value", async ({ page }) => {
    await input(page).fill("bra")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await page.keyboard.press("Escape")
    await page.getByRole("button", { name: "Remove Brazil" }).click()
    await expect(page.getByRole("button", { name: "Remove Brazil" })).toHaveCount(0)
    expect(await lastAction(page)).toBe("value:")
  })
})

test.describe("groups", () => {
  test("items sit in groups named by their labels, and empty groups hide while filtering", async ({
    page,
    open,
  }) => {
    await open("combobox", { grouped: "" })
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("group", { name: "Europe" })).toBeVisible()
    await input(page).fill("bra")
    await expect(page.getByRole("group", { name: "Europe" })).toBeHidden()
    await expect(page.getByRole("group", { name: "Americas" }).getByRole("option")).toHaveText(["Brazil"], {
      useInnerText: true,
    })
  })
})

test.describe("forms", () => {
  test("the form submits the value under the combobox's name", async ({ page, open }) => {
    await open("combobox", { value: "fr" })
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByRole("status", { name: "Submitted" })).toHaveText("country=fr")
  })

  test("several values submit under one name", async ({ page, open }) => {
    await open("combobox", { multiple: "", value: "fr,de" })
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByRole("status", { name: "Submitted" })).toHaveText("country=fr&country=de")
  })

  test("a required combobox blocks submission until a value is chosen", async ({ page, open }) => {
    await open("combobox", { required: "" })
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByRole("status", { name: "Submitted" })).toHaveText("")
  })

  test("a disabled combobox can't be focused", async ({ page, open }) => {
    await open("combobox", { disabled: "" })
    await expect(input(page)).toBeDisabled()
  })

  test("a disabled fieldset disables the combobox and leaves it out of the form", async ({ page, open }) => {
    await open("combobox", { fieldset: "", value: "fr" })
    await expect(input(page)).toBeDisabled()
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByRole("status", { name: "Submitted" })).toHaveText("")
  })
})

test.describe("async", () => {
  test("results load for the text, with the list kept while loading", async ({ page, open }) => {
    await open("combobox", { async: "" })
    await input(page).fill("ger")
    await expect(options(page)).toHaveText(["Germany"], { useInnerText: true })
    await input(page).fill("au")
    await expect(options(page)).toHaveText(["Australia", "Austria"], { useInnerText: true })
  })

  test("the chosen item's label survives results that don't include it", async ({ page, open }) => {
    await open("combobox", { async: "" })
    await input(page).fill("ger")
    await expect(options(page)).toHaveText(["Germany"], { useInnerText: true })
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(input(page)).toHaveValue("Germany")
    await input(page).fill("bra")
    await expect(options(page)).toHaveText(["Brazil"], { useInnerText: true })
    await page.keyboard.press("Escape")
    await page.mouse.click(5, 5)
    await expect(input(page)).toHaveValue("Germany")
  })
})
