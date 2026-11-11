import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, patternProblems, test } from "../fixtures"

const input = (page: Page) => page.getByRole("combobox", { name: "Country" })
const listbox = (page: Page) => page.getByRole("listbox")

async function audit(page: Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations while closed", async ({ page, open }) => {
  await open("combobox")
  expect(await audit(page)).toEqual([])
})

test.describe("while open", { tag: "@enhancement" }, () => {
  test("no axe violations while open and filtered, with an item highlighted", async ({
    page,
    open,
  }) => {
    await open("combobox")
    await input(page).fill("a")
    await page.keyboard.press("ArrowDown")
    await expect(listbox(page)).toBeVisible()
    expect(await audit(page)).toEqual([])
  })

  test("no axe violations with nothing found", async ({ page, open }) => {
    await open("combobox")
    await input(page).fill("zzz")
    await expect(page.getByText("No countries found")).toBeVisible()
    expect(await audit(page)).toEqual([])
  })

  test("no axe violations with chips", async ({ page, open }) => {
    await open("combobox", { multiple: "", value: "br,fr" })
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(listbox(page)).toBeVisible()
    expect(await audit(page)).toEqual([])
  })

  test("no axe violations with groups", async ({ page, open }) => {
    await open("combobox", { grouped: "" })
    await input(page).focus()
    await page.keyboard.press("ArrowDown")
    await expect(listbox(page)).toBeVisible()
    expect(await audit(page)).toEqual([])
  })
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("combobox", { value: "fr" })
  await input(page).focus()
  await page.keyboard.press("ArrowDown")
  await expect(listbox(page)).toBeVisible()
  await expect(input(page)).toMatchAriaSnapshot(
    `- combobox "Country" [expanded]: France`
  )
  await expect(listbox(page)).toMatchAriaSnapshot(`
    - listbox:
      - option "Argentina"
      - option "Australia"
      - option "Austria"
      - option "Belgium"
      - option "Brazil"
      - option "Canada"
      - option "Chile"
      - option "Denmark" [disabled]
      - option "France" [selected]
      - option "Germany"
  `)
})

test("checkPattern finds no problems with the combobox pattern", async ({
  page,
  open,
}) => {
  await open("combobox")
  expect(await patternProblems(page, "combobox")).toBe("")
})
