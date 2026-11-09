import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

const trigger = (page: Page) => page.getByRole("combobox", { name: "Fruit" })
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
  await open("select")
  expect(await audit(page)).toEqual([])
})

test.describe("while open", { tag: "@enhancement" }, () => {
  test("no axe violations while open", async ({ page, open }) => {
    await open("select", { value: "banana" })
    await trigger(page).click()
    await expect(listbox(page)).toBeVisible()
    expect(await audit(page)).toEqual([])
  })

  test("no axe violations while open with groups", async ({ page, open }) => {
    await open("select", { grouped: "" })
    await trigger(page).click()
    await expect(listbox(page)).toBeVisible()
    expect(await audit(page)).toEqual([])
  })

  test("no axe violations while open with multiple selection", async ({
    page,
    open,
  }) => {
    await open("select", { multiple: "", value: "apple,mango" })
    await trigger(page).click()
    await expect(listbox(page)).toBeVisible()
    expect(await audit(page)).toEqual([])
  })
})

test("the trigger advertises a listbox", async ({ page, open }) => {
  await open("select")
  await expect(trigger(page)).toHaveAttribute("aria-haspopup", "listbox")
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("select", { value: "banana" })
  await trigger(page).click()
  await expect(listbox(page)).toBeVisible()
  await expect(trigger(page)).toMatchAriaSnapshot(
    `- combobox "Fruit" [expanded]: Banana`
  )
  await expect(listbox(page)).toMatchAriaSnapshot(`
    - listbox:
      - option "Apple"
      - option "Banana" [selected]
      - option "Blueberry"
      - option "Cherry"
      - option "Grape" [disabled]
      - option "Lemon"
      - option "Mango"
      - option "Orange"
  `)
})
