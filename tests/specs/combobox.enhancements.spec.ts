import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"
import { comboboxFixture as f } from "../fixtures/combobox"
import { scrollIn, scrolledIntoView } from "../fixtures/popup"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

const input = (page: Page) => page.getByRole("combobox", { name: "Country" })
const listbox = (page: Page) => page.getByRole("listbox")
const option = (page: Page, name: string) => page.getByRole("option", { name, exact: true })
const options = (page: Page) => listbox(page).getByRole("option")

async function choose(page: Page, text: string) {
  await input(page).fill(text)
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
}

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("the list is named by the combobox's label", async ({ page, open }) => {
    await open("combobox")
    await input(page).fill("a")
    await expect(page.getByRole("listbox", { name: "Country" })).toBeVisible()
  })

  test("filtering matches an item's keywords as well as its label", async ({ page, open }) => {
    await open("combobox")
    await input(page).fill("deutsch")
    await expect(options(page)).toHaveText(["Germany"], { useInnerText: true })
  })

  test("a create option offers the text, and hides when an item's label matches it exactly", async ({
    page,
    open,
  }) => {
    await open("combobox", { create: "" })
    await input(page).fill("Kiwi")
    await expect(option(page, "Create “Kiwi”")).toBeVisible()
    await input(page).fill("france")
    await expect(option(page, "Create “france”")).toHaveCount(0)
  })

  test("Enter on the create option calls onCreate with the text", async ({ page, open }) => {
    await open("combobox", { create: "" })
    await input(page).fill("Kiwi")
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("Enter")
    await expect.poll(() => lastAction(page)).toBe("create:Kiwi")
    await expect(listbox(page)).toBeHidden()
  })

  test("a create option is pending while onCreate's Promise runs", async ({ page, open }) => {
    await open("combobox", { create: "", slow: "" })
    await input(page).fill("Kiwi")
    const create = option(page, "Create “Kiwi”")
    await create.click()
    await expect(create).toHaveAttribute("data-pending", "")
    await expect(create).toHaveAttribute("aria-busy", "true")
    await expect(create).toHaveAttribute("aria-disabled", "true")
    await expect(listbox(page)).toBeHidden()
  })

  test("with multiple, the list stays open after choosing", async ({ page, open }) => {
    await open("combobox", { multiple: "" })
    await choose(page, "bra")
    await expect(listbox(page)).toBeVisible()
    await expect(option(page, "Brazil")).toHaveAttribute("aria-selected", "true")
  })

  test("maxSelected disables the other items once reached", async ({ page, open }) => {
    await open("combobox", { multiple: "", max: "2" })
    await choose(page, "bra")
    await choose(page, "can")
    await input(page).fill("")
    await expect(option(page, "France")).toHaveAttribute("aria-disabled", "true")
    await expect(option(page, "Brazil")).not.toHaveAttribute("aria-disabled", "true")
    await option(page, "France").click({ force: true })
    expect(await lastAction(page)).toBe("value:br,ca")
  })

  test("arrow keys move between chips, and Backspace on one removes it", async ({ page, open }) => {
    await open("combobox", { multiple: "", value: "br,ca,fr" })
    await input(page).focus()
    await page.keyboard.press("ArrowLeft")
    await expect(page.locator('[data-slot="combobox-chip"]', { hasText: "France" })).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await expect(page.locator('[data-slot="combobox-chip"]', { hasText: "Canada" })).toBeFocused()
    await page.keyboard.press("Backspace")
    expect(await lastAction(page)).toBe("value:br,fr")
    await expect(page.locator('[data-slot="combobox-chip"]', { hasText: "Brazil" })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(input(page)).toBeFocused()
  })

  test("the chips are a toolbar named by the combobox's label", async ({ page, open }) => {
    await open("combobox", { multiple: "", value: "br,ca" })
    await expect(page.getByRole("toolbar", { name: "Country" })).toBeVisible()
  })

  test("web chips follow a label that changes after they rendered", async ({ page, open, framework }) => {
    test.skip(!framework.startsWith("web"), "Framework chips render their labels from state.")
    await open("combobox", { multiple: "", value: "br" })
    await expect(page.locator('[data-slot="combobox-chip"]')).toHaveText(/Brazil/)
    await page.locator("ui-combobox").evaluate((el: HTMLElement & Record<string, any>) => {
      el.itemToLabel = (value: string) => `Country ${value}`
    })
    await expect(page.locator('[data-slot="combobox-chip"]')).toHaveText(/Country br/)
    await expect(page.getByRole("button", { name: "Remove Country br" })).toBeVisible()
  })

  test("Enter on the trigger opens the list as the keyboard did", async ({ page, open }) => {
    await open("combobox")
    await page.getByRole("button", { name: f.trigger }).focus()
    await page.keyboard.press("Enter")
    await expect(listbox(page)).toBeVisible()
    await expect(page.locator('[data-slot="combobox-content"]')).toHaveAttribute("data-modality", "keyboard")
  })

  test("ArrowDown on the trigger opens the list at its first item", async ({ page, open }) => {
    await open("combobox")
    await page.getByRole("button", { name: f.trigger }).focus()
    await page.keyboard.press("ArrowDown")
    await expect(listbox(page)).toBeVisible()
    await expect(options(page).first()).toHaveAttribute("data-highlighted", "")
  })

  test("the content says whether the keyboard or a pointer is in use, while focus stays in the input", async ({
    page,
    open,
  }) => {
    await open("combobox")
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    const content = page.locator('[data-slot="combobox-content"]')
    await expect(content).toHaveAttribute("data-modality", "keyboard")
    const box = (await option(page, "Chile").boundingBox())!
    await page.mouse.move(box.x + 5, box.y + 5)
    await page.mouse.move(box.x + 20, box.y + 8)
    await expect(content).toHaveAttribute("data-modality", "pointer")
    await page.keyboard.press("ArrowDown")
    await expect(content).toHaveAttribute("data-modality", "keyboard")
  })

  test("a form reset returns the combobox to its default value and label", async ({ page, open }) => {
    await open("combobox", { value: "fr" })
    await choose(page, "bra")
    await expect(input(page)).toHaveValue("Brazil")
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(input(page)).toHaveValue("France")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect(page.getByRole("status", { name: "Submitted" })).toHaveText("country=fr")
  })

  for (const part of ["content", "list"] as const) {
    test(`arrow keys keep the highlighted item in view when the ${part} scrolls`, async ({ page, open }) => {
      await open("combobox")
      await input(page).focus()
      await page.keyboard.press("ArrowDown")
      await expect(listbox(page)).toBeVisible()
      await scrollIn(listbox(page), part)
      const last = listbox(page).getByRole("option", { name: "Germany", exact: true })
      for (let i = 0; i < 12 && (await last.getAttribute("data-highlighted")) === null; i++)
        await page.keyboard.press("ArrowDown")
      await expect(last).toHaveAttribute("data-highlighted", "")
      expect(await scrolledIntoView(last)).toBe(true)
    })
  }
})
