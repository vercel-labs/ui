import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { toastFixture, toastRole } from "../fixtures/toast"

const role = () => toastRole

const { basic, error, success, dialog } = toastFixture
const region = (page: Page) =>
  page.getByRole("region", { name: toastFixture.region })

async function audit(page: Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations without toasts", async ({ page, open }) => {
  await open("toast")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with toasts of every kind", async ({ page, open }) => {
  await open("toast")
  for (const trigger of [basic.trigger, success.trigger, error.trigger]) {
    await page.getByRole("button", { name: trigger }).click()
  }
  await expect(region(page).getByRole(role())).toHaveCount(3)
  expect(await audit(page)).toEqual([])
})

test("no axe violations while the stack is expanded and a toast is focused", async ({
  page,
  open,
}) => {
  await open("toast")
  await page.getByRole("button", { name: basic.trigger }).click()
  await page.keyboard.press("F6")
  await expect(region(page)).toHaveAttribute("data-expanded", "")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with a toast over a modal dialog", async ({
  page,
  open,
}) => {
  await open("toast")
  await page.getByRole("button", { name: dialog.trigger }).click()
  await page.getByRole("button", { name: dialog.toast }).click()
  await expect(region(page).getByRole(role())).toHaveCount(1)
  expect(await audit(page)).toEqual([])
})

test(
  "no axe violations with the overlay host's toasts and question",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("toast", { host: "" })
    await page.getByRole("button", { name: basic.trigger }).click()
    await page
      .getByRole("button", { name: toastFixture.confirm.trigger })
      .click()
    await expect(
      page.getByRole("alertdialog", { name: toastFixture.confirm.title })
    ).toBeVisible()
    expect(await audit(page)).toEqual([])
  }
)

test("a toast is named by its title and described by its description", async ({
  page,
  open,
}) => {
  await open("toast")
  await page.getByRole("button", { name: basic.trigger }).click()
  const toast = region(page).getByRole(role(), { name: basic.title })
  await expect(toast).toHaveAccessibleDescription(basic.description)
})

test(
  "the accessibility tree is the same in every framework",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: basic.trigger }).click()
    await page.getByRole("button", { name: error.trigger }).click()
    await expect(region(page)).toMatchAriaSnapshot(`
    - region "Notifications":
      - list:
        - listitem "Upload failed":
          - text: Upload failed The file is too large.
          - button "Dismiss"
        - listitem "Event created":
          - text: Event created Sunday, December 3 at 9:00 AM
          - button "Undo"
          - button "Dismiss"
  `)
  }
)
