import AxeBuilder from "@axe-core/playwright"
import { expect, patternProblems, test } from "../fixtures"
import { maximum, minimum, volume } from "./slider.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations at first", async ({ page, open }) => {
  await open("slider")
  await expect(volume(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations when vertical", async ({ page, open }) => {
  await open("slider", { orientation: "vertical" })
  await expect(volume(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations when disabled", async ({ page, open }) => {
  await open("slider", { disabled: "" })
  await expect(volume(page)).toBeDisabled()
  expect(await audit(page)).toEqual([])
})

test("a single thumb is named by its field's label", async ({ page, open }) => {
  await open("slider")
  await expect(volume(page)).toHaveAccessibleName("Volume")
  await expect(volume(page)).toHaveAccessibleDescription(
    "How loud the room is."
  )
})

test("range thumbs have their own names, in a group named by the label", async ({
  page,
  open,
}) => {
  await open("slider")
  await expect(minimum(page)).toBeVisible()
  await expect(maximum(page)).toBeVisible()
  await expect(page.getByRole("group", { name: "Price" })).toBeVisible()
})

test("the accessibility tree", async ({ page, open }) => {
  await open("slider")
  await expect(page.getByRole("group").filter({ has: volume(page) }))
    .toMatchAriaSnapshot(`
    - group:
      - status: "50"
      - slider "Volume": "50"
  `)
  await expect(page.getByRole("group", { name: "Price" })).toMatchAriaSnapshot(`
    - group "Price":
      - status: 20 – 80
      - slider "Minimum price": "20"
      - slider "Maximum price": "80"
  `)
})

test("checkPattern finds no problems with the slider pattern", async ({
  page,
  open,
}) => {
  await open("slider")
  expect(await patternProblems(page, "slider")).toBe("")
})
