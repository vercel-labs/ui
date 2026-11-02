import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

const dialog = (page: Page) => page.getByRole("dialog", { name: "Edit profile" })
const trigger = (page: Page) => page.getByRole("button", { name: "Profile" })

async function audit(page: Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`)
}

test("no axe violations while closed", async ({ page, open }) => {
  await open("popover")
  expect(await audit(page)).toEqual([])
})

test("no axe violations while open", async ({ page, open }) => {
  await open("popover")
  await trigger(page).click()
  await expect(dialog(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations while open as a modal", async ({ page, open }) => {
  await open("popover", { modal: "true" })
  await trigger(page).click()
  await expect(dialog(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("the popover is named by its title and described by its description", async ({ page, open }) => {
  await open("popover")
  await trigger(page).click()
  await expect(dialog(page)).toHaveAccessibleName("Edit profile")
  await expect(dialog(page)).toHaveAccessibleDescription("Your name appears on your posts.")
})

test("the trigger advertises a dialog", async ({ page, open }) => {
  await open("popover")
  await expect(trigger(page)).toHaveAttribute("aria-haspopup", "dialog")
})

test(
  "only modal popovers are marked modal for assistive technology",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("popover")
    await trigger(page).click()
    await expect(dialog(page)).not.toHaveAttribute("aria-modal", "true")
    await open("popover", { modal: "trap-focus" })
    await trigger(page).click()
    await expect(dialog(page)).not.toHaveAttribute("aria-modal", "true")
    await open("popover", { modal: "true" })
    await trigger(page).click()
    await expect(dialog(page)).toHaveAttribute("aria-modal", "true")
  },
)

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("popover")
  await trigger(page).click()
  await expect(dialog(page)).toMatchAriaSnapshot(`
    - dialog "Edit profile":
      - heading "Edit profile" [level=2]
      - paragraph: Your name appears on your posts.
      - text: Display name
      - textbox "Display name": Ada
      - button "Save"
      - button "Close"
  `)
})
