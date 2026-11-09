import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

const dialog = (page: Page) =>
  page.getByRole("dialog", { name: "Profile settings" })
const trigger = (page: Page) =>
  page.getByRole("button", { name: "Edit profile" })
const alert = (page: Page) =>
  page.getByRole("alertdialog", { name: "Delete project?" })

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
  await open("dialog")
  expect(await audit(page)).toEqual([])
})

test("no axe violations while open", async ({ page, open }) => {
  await open("dialog")
  await trigger(page).click()
  await expect(dialog(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations while a nested dialog is open", async ({
  page,
  open,
}) => {
  await open("dialog", { nested: "" })
  await trigger(page).click()
  await page.getByRole("button", { name: "Advanced" }).click()
  await expect(
    page.getByRole("dialog", { name: "Advanced settings" })
  ).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations while open without modality", async ({
  page,
  open,
}) => {
  await open("dialog", { modal: "false" })
  await trigger(page).click()
  await expect(dialog(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations while the alert dialog is open", async ({
  page,
  open,
}) => {
  await open("dialog")
  await page.getByRole("button", { name: "Delete project" }).click()
  await expect(alert(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("the dialog is named by its title and described by its description", async ({
  page,
  open,
}) => {
  await open("dialog")
  await trigger(page).click()
  await expect(dialog(page)).toHaveAccessibleName("Profile settings")
  await expect(dialog(page)).toHaveAccessibleDescription(
    "Make changes to your profile."
  )
})

test("the alert dialog is named by its title and described by its message", async ({
  page,
  open,
}) => {
  await open("dialog")
  await page.getByRole("button", { name: "Delete project" }).click()
  await expect(alert(page)).toHaveAccessibleName("Delete project?")
  await expect(alert(page)).toHaveAccessibleDescription(
    "This permanently deletes the project and its files."
  )
})

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("a modal dialog is marked modal for assistive technology, and a non-modal one isn't", async ({
    page,
    open,
  }) => {
    await open("dialog")
    await trigger(page).click()
    await expect(dialog(page)).toHaveAttribute("aria-modal", "true")
    await open("dialog", { modal: "false" })
    await trigger(page).click()
    await expect(dialog(page)).not.toHaveAttribute("aria-modal", "true")
  })

  test("the alert dialog is marked modal for assistive technology", async ({
    page,
    open,
  }) => {
    await open("dialog")
    await page.getByRole("button", { name: "Delete project" }).click()
    await expect(alert(page)).toHaveAttribute("aria-modal", "true")
  })

  test("the trigger of a modal dialog has no aria-expanded, which would read as collapsed", async ({
    page,
    open,
  }) => {
    await open("dialog")
    await expect(trigger(page)).not.toHaveAttribute("aria-expanded")
    await trigger(page).click()
    await page.keyboard.press("Escape")
    await expect(trigger(page)).toBeFocused()
    await expect(trigger(page)).not.toHaveAttribute("aria-expanded")
  })

  test("without a title, the dialog is named after its trigger even though the trigger is inert", async ({
    page,
    open,
  }) => {
    await open("dialog", { untitled: "" })
    await trigger(page).click()
    await expect(
      page.getByRole("dialog", { name: "Edit profile" })
    ).toBeVisible()
  })
})

test("the trigger of a non-modal dialog says whether it's expanded", async ({
  page,
  open,
}) => {
  await open("dialog", { modal: "false" })
  await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
  await trigger(page).click()
  await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
})

test("the trigger of a dialog that only traps focus says whether it's expanded", async ({
  page,
  open,
}) => {
  await open("dialog", { modal: "trap-focus" })
  await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
  await trigger(page).click()
  await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
})

test("aria-describedby is absent when no description is rendered", async ({
  page,
  open,
}) => {
  await open("dialog", { nested: "" })
  await trigger(page).click()
  await page.getByRole("button", { name: "Advanced" }).click()
  await expect(
    page.getByRole("dialog", { name: "Advanced settings" })
  ).not.toHaveAttribute("aria-describedby")
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("dialog")
  await trigger(page).click()
  await expect(dialog(page)).toMatchAriaSnapshot(`
    - dialog "Profile settings":
      - heading "Profile settings" [level=2]
      - paragraph: Make changes to your profile.
      - text: Display name
      - textbox "Display name": Ada
      - button "Save"
      - button "Close"
  `)
})

test("alert dialog accessibility tree", async ({ page, open }) => {
  await open("dialog")
  await page.getByRole("button", { name: "Delete project" }).click()
  await expect(alert(page)).toMatchAriaSnapshot(`
    - alertdialog "Delete project?":
      - heading "Delete project?" [level=2]
      - paragraph: This permanently deletes the project and its files.
      - button "Cancel"
      - button "Delete"
  `)
})
