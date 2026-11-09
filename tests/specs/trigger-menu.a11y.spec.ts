import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// ARIA for suggestions in a text field. A <textarea> may only be a textbox, and
// a textbox may not take aria-expanded, so it keeps its role and points at the
// list with aria-controls. An <input> is a combobox, as the APG pattern says.

const field = (page: Page) => page.getByRole("textbox", { name: "Message" })
const listbox = (page: Page) => page.getByRole("listbox", { name: "Message" })

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
  await open("trigger-menu")
  expect(await audit(page)).toEqual([])
})

test("no axe violations while open with an item highlighted", async ({
  page,
  open,
}) => {
  await open("trigger-menu")
  await field(page).focus()
  await page.keyboard.type("@a")
  await page.keyboard.press("ArrowDown")
  await expect(listbox(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations while open on an input", async ({ page, open }) => {
  await open("trigger-menu", { input: "" })
  await page.getByRole("combobox", { name: "Message" }).focus()
  await page.keyboard.type("@a")
  await page.keyboard.press("ArrowDown")
  await expect(listbox(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations with nothing found", async ({ page, open }) => {
  await open("trigger-menu", { empty: "" })
  await field(page).focus()
  await page.keyboard.type("@zz")
  await expect(page.getByText("No matches")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("a textarea stays a textbox, without aria-expanded, and controls the list while open", async ({
  page,
  open,
}) => {
  await open("trigger-menu")
  await expect(field(page)).toHaveAttribute("aria-autocomplete", "list")
  await expect(field(page)).toHaveAttribute("aria-haspopup", "listbox")
  await expect(field(page)).not.toHaveAttribute("aria-expanded", /.*/)
  await expect(field(page)).not.toHaveAttribute("aria-controls", /.*/)
  await field(page).focus()
  await page.keyboard.type("@a")
  const id = await listbox(page).getAttribute("id")
  await expect(field(page)).toHaveAttribute("aria-controls", id!)
  await expect(field(page)).not.toHaveAttribute("role", /.*/)
})

test("an input is a combobox that says whether it's expanded", async ({
  page,
  open,
}) => {
  await open("trigger-menu", { input: "" })
  const input = page.getByRole("combobox", { name: "Message" })
  await expect(input).toHaveAttribute("aria-expanded", "false")
  await input.focus()
  await page.keyboard.type("@a")
  await expect(input).toHaveAttribute("aria-expanded", "true")
})

test("aria-activedescendant waits for an arrow key and clears on the next edit", async ({
  page,
  open,
}) => {
  await open("trigger-menu")
  await field(page).focus()
  await page.keyboard.type("@a")
  await expect(listbox(page)).toBeVisible()
  await expect(page.locator('[role="option"][data-highlighted]')).toHaveText(
    "Alice Smith"
  )
  await expect(field(page)).not.toHaveAttribute("aria-activedescendant", /.*/)
  await page.keyboard.press("ArrowDown")
  const id = await page
    .getByRole("option", { name: "Carol White" })
    .getAttribute("id")
  await expect(field(page)).toHaveAttribute("aria-activedescendant", id!)
  await page.keyboard.type("r")
  await expect(field(page)).not.toHaveAttribute("aria-activedescendant", /.*/)
})

test("two menus on a page have their own ids, and the role never changes", async ({
  page,
  open,
}) => {
  await open("trigger-menu", { twice: "" })
  const second = page.getByRole("textbox", { name: "Second" })
  await second.focus()
  await page.keyboard.type("@a")
  await page.keyboard.press("ArrowDown")
  const list = page.getByRole("listbox", { name: "Second" })
  await expect(list).toBeVisible()
  const ids = await page.evaluate(() =>
    [...document.querySelectorAll("[id]")].map((el) => el.id)
  )
  expect(new Set(ids).size).toBe(ids.length)
  await expect(second).toHaveAttribute(
    "aria-controls",
    (await list.getAttribute("id"))!
  )
  await expect(field(page)).not.toHaveAttribute("aria-controls", /.*/)
})

test("options are named by their text", async ({ page, open }) => {
  await open("trigger-menu")
  await field(page).focus()
  await page.keyboard.type("@")
  await expect(page.getByRole("option", { name: "José García" })).toBeVisible()
  await expect(page.getByRole("option").first()).not.toHaveAttribute(
    "aria-label",
    /.*/
  )
})

test("the status says the count and the keys once typing pauses, then that nothing matches", async ({
  page,
  open,
}) => {
  await open("trigger-menu", { empty: "" })
  const status = page.locator(".status")
  await field(page).focus()
  await page.keyboard.type("@a")
  await expect(status).toHaveText(
    /^4 suggestions\. Up and Down to choose, Enter to insert\s?$/
  )
  await page.keyboard.type("zz")
  await expect(status).toHaveText(/^No matches\s?$/)
})

test("the hint is hidden from assistive technology, and the status names the argument", async ({
  page,
  open,
}) => {
  await open("trigger-menu")
  await field(page).focus()
  await page.keyboard.type("/sea")
  await page.keyboard.press("Enter")
  await expect(page.locator(".hint")).toHaveAttribute("aria-hidden", "true")
  await expect(page.locator(".status")).toHaveText(/^query\. <query>\s?$/)
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("trigger-menu")
  await field(page).focus()
  await page.keyboard.type("@jos")
  await expect(listbox(page)).toBeVisible()
  await expect(listbox(page)).toMatchAriaSnapshot(`
    - listbox "Message":
      - option "José García" [selected]
  `)
})
