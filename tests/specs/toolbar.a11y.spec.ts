import AxeBuilder from "@axe-core/playwright"
import { expect, menuNamed, patternProblems, test } from "../fixtures"
import { toolbar, walkTo } from "./toolbar.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations at rest", async ({ page, open }) => {
  await open("toolbar")
  expect(await audit(page)).toEqual([])
})

test("no axe violations in a vertical toolbar", async ({ page, open }) => {
  await open("toolbar", { orientation: "vertical" })
  expect(await audit(page)).toEqual([])
})

test("no axe violations in a disabled toolbar", async ({ page, open }) => {
  await open("toolbar", { disabled: "" })
  expect(await audit(page)).toEqual([])
})

test("no axe violations with focus on a disabled button", async ({
  page,
  open,
  tab,
}) => {
  await open("toolbar")
  await walkTo(page, tab, "Redo")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with a menu open from the toolbar", async ({
  page,
  open,
}) => {
  await open("toolbar")
  await page.getByRole("button", { name: "Font" }).click()
  await expect(menuNamed(page, "Font")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("toolbar")
  await expect(toolbar(page)).toMatchAriaSnapshot(`
    - toolbar "Formatting":
      - group "Text style":
        - button "Bold" [pressed]
        - button "Italic"
        - button "Underline" [disabled]
      - separator
      - group "Alignment":
        - button "Left" [pressed]
        - button "Center"
        - button "Right"
      - separator
      - button "Font"
      - textbox "Font size": "14"
      - textbox "Comment": Draft
      - group "History":
        - button "Undo"
        - button "Redo" [disabled]
      - button "Spellcheck"
      - link "Help"
  `)
})

test("checkPattern finds no problems with the toolbar pattern", async ({
  page,
  open,
}) => {
  await open("toolbar")
  expect(await patternProblems(page, "toolbar")).toBe("")
})
