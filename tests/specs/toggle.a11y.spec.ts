import AxeBuilder from "@axe-core/playwright"
import { buttonNamed, expect, test } from "../fixtures"

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
  await open("toggle")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with toggles pressed", async ({ page, open }) => {
  await open("toggle")
  await buttonNamed(page, "Bookmark").click()
  await buttonNamed(page, "Italic").click()
  await expect(buttonNamed(page, "Italic")).toHaveAttribute(
    "aria-pressed",
    "true"
  )
  expect(await audit(page)).toEqual([])
})

test("no axe violations in vertical groups", async ({ page, open }) => {
  await open("toggle", { orientation: "vertical" })
  expect(await audit(page)).toEqual([])
})

test("no axe violations in a disabled group", async ({ page, open }) => {
  await open("toggle", { disabled: "" })
  expect(await audit(page)).toEqual([])
})

test("no axe violations with focus on a disabled toggle", async ({
  page,
  open,
}) => {
  await open("toggle")
  await buttonNamed(page, "Bold").focus()
  await page.keyboard.press("End")
  expect(await audit(page)).toEqual([])
})

test("groups are named, and toggles are named by their text", async ({
  page,
  open,
}) => {
  await open("toggle")
  await expect(
    page.getByRole("group", { name: "Text alignment" })
  ).toBeVisible()
  await expect(
    page.getByRole("group", { name: "Text formatting" })
  ).toBeVisible()
  await expect(buttonNamed(page, "Bookmark")).toBeVisible()
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("toggle")
  await expect(page.getByRole("group", { name: "Text alignment" }))
    .toMatchAriaSnapshot(`
    - group "Text alignment":
      - button "Left" [pressed]
      - button "Center"
      - button "Right"
  `)
  await expect(page.getByRole("group", { name: "Text formatting" }))
    .toMatchAriaSnapshot(`
    - group "Text formatting":
      - button "Bold" [pressed]
      - button "Italic"
      - button "Underline"
      - button "Strikethrough" [disabled]
  `)
  await expect(page.locator(".fixture")).toMatchAriaSnapshot(`
    - button "Bookmark"
    - group "Text alignment"
    - separator
    - group "Text formatting"
    - form "Profile":
      - text: Name
      - textbox "Name"
      - button "Submit"
      - button "Reset"
      - button "Delete" [disabled]
      - button "Archive" [disabled]
    - button "Save"
    - button "Publish"
  `)
})
