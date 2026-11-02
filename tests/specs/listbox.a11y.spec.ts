import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { list, option } from "./listbox.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`)
}

const states: [string, Record<string, string>][] = [
  ["at rest", {}],
  ["with a selection", { value: "cheese" }],
  ["with multiple selected", { multiple: "", value: "basil,onion" }],
  ["with groups", { grouped: "", value: "garlic" }],
  ["horizontal", { orientation: "horizontal" }],
  ["disabled", { disabled: "" }],
  ["read-only and required", { readonly: "", required: "" }],
]

for (const [name, options] of states) {
  test(`no axe violations ${name}`, async ({ page, open }) => {
    await open("listbox", options)
    await expect(list(page)).toBeVisible()
    expect(await audit(page)).toEqual([])
  })
}

test("no axe violations with focus on a disabled option", async ({ page, open }) => {
  await open("listbox")
  await option(page, "Olive").click({ force: true })
  await expect(option(page, "Olive")).toBeFocused()
  expect(await audit(page)).toEqual([])
})

test("the listbox is named, and says it holds several with multiple", async ({ page, open }) => {
  await open("listbox", { multiple: "" })
  await expect(list(page)).toHaveAttribute("aria-multiselectable", "true")
  await expect(list(page)).toHaveAttribute("aria-orientation", "vertical")
})

test("every option says whether it's selected", async ({ page, open }) => {
  await open("listbox", { multiple: "", value: "basil" })
  await expect(option(page, "Basil")).toHaveAttribute("aria-selected", "true")
  await expect(option(page, "Cheese")).toHaveAttribute("aria-selected", "false")
})

test("groups are named by their labels", async ({ page, open }) => {
  await open("listbox", { grouped: "" })
  await expect(page.getByRole("group", { name: "Herbs" })).toBeVisible()
  await expect(page.getByRole("group", { name: "Vegetables" })).toBeVisible()
})

test("icons and checks stay out of the options' names", async ({ page, open }) => {
  await open("listbox", { value: "basil" })
  await expect(page.getByRole("option", { name: "Basil", exact: true })).toBeVisible()
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("listbox", { value: "cheese" })
  await expect(list(page)).toMatchAriaSnapshot(`
    - listbox "Toppings":
      - option "Basil"
      - option "Cheese" [selected]
      - option "Garlic"
      - option "Mushroom"
      - option "Olive" [disabled]
      - option "Onion"
      - option "Pepper"
      - option "Tomato"
  `)
})

test("accessibility tree with groups", async ({ page, open }) => {
  await open("listbox", { grouped: "", multiple: "", value: "onion" })
  await expect(list(page)).toMatchAriaSnapshot(`
    - listbox "Toppings":
      - group "Herbs":
        - text: Herbs
        - option "Basil"
        - option "Garlic"
      - group "Vegetables":
        - text: Vegetables
        - option "Mushroom"
        - option "Onion" [selected]
        - option "Pepper"
  `)
})
