import { expect } from "@playwright/test"
import { test } from "./docs-test"

// The lists of tests on each page say where those tests run: the playground
// runs React, Vue and web components.

test("a spec list says which frameworks its tests run in", async ({ page }) => {
  await page.goto("/docs/react/components/combobox")
  await expect(page.getByText("Runs in React, Vue and web components.").first()).toBeVisible()
  // The virtual list has a React fixture only.
  await expect(page.getByText("Runs in React.", { exact: true })).toBeVisible()
})

test("a test that skips some frameworks says where it runs", async ({ page }) => {
  await page.goto("/docs/react/components/input")
  const line = page.getByRole("listitem").filter({ hasText: "<ui-input>'s value property writes the field" })
  await expect(line).toContainText("Web components only.")
  // The rest run everywhere, so they don't say.
  const other = page
    .getByRole("listitem")
    .filter({ hasText: "The clear button hides while its field is disabled" })
  await expect(other).not.toContainText("only.")
})

test("a skip in a group's hook counts for every test in the group", async ({ page }) => {
  await page.goto("/docs/react/components/checkbox")
  const line = page.getByRole("listitem").filter({ hasText: "Take part in the form with no hidden input" })
  await expect(line).toContainText("Web components only.")
})

test("titles leave out the test runner's tags", async ({ page }) => {
  await page.goto("/docs/react/components/carousel")
  await expect(
    page.getByRole("listitem").filter({ hasText: "Home and End go to the first and last slide" }),
  ).toBeVisible()
  await expect(page.getByText("@enhancement")).toHaveCount(0)
})
