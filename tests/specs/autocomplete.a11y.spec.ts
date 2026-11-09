import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

const input = (page: Page) => page.getByRole("combobox", { name: "Fruit" })
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
  await open("autocomplete")
  expect(await audit(page)).toEqual([])
})

test.describe("while open", { tag: "@enhancement" }, () => {
  test("no axe violations while open, with a suggestion highlighted", async ({
    page,
    open,
  }) => {
    await open("autocomplete")
    await input(page).fill("a")
    await page.keyboard.press("ArrowDown")
    await expect(listbox(page)).toBeVisible()
    expect(await audit(page)).toEqual([])
  })

  test("no axe violations with groups", async ({ page, open }) => {
    await open("autocomplete", { grouped: "" })
    await input(page).fill("e")
    await expect(listbox(page)).toBeVisible()
    expect(await audit(page)).toEqual([])
  })

  test("no axe violations with nothing found", async ({ page, open }) => {
    await open("autocomplete")
    await input(page).fill("zzz")
    await expect(page.getByText("No fruits found")).toBeVisible()
    expect(await audit(page)).toEqual([])
  })
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("autocomplete")
  await input(page).fill("b")
  await expect(listbox(page)).toBeVisible()
  await expect(input(page)).toMatchAriaSnapshot(
    `- combobox "Fruit" [expanded]: b`
  )
  await expect(listbox(page)).toMatchAriaSnapshot(`
    - listbox:
      - option "Banana"
      - option "Blackberry"
      - option "Blueberry"
  `)
})
