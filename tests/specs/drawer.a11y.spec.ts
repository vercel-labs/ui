import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import {
  drawerDialog,
  drawerTrigger,
  handle,
  openDrawer,
  waitForRest,
} from "./drawer.helpers"

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
  await open("drawer")
  expect(await audit(page)).toEqual([])
})

test("no axe violations while open", async ({ page, open }) => {
  await open("drawer", { snap: "0.25,0.5,1", scroll: "" })
  await openDrawer(page)
  expect(await audit(page)).toEqual([])
})

test("no axe violations while a nested drawer is open", async ({
  page,
  open,
}) => {
  await open("drawer", { nested: "" })
  await openDrawer(page)
  await page.getByRole("button", { name: "More options" }).click()
  await waitForRest(page, "More options")
  expect(await audit(page)).toEqual([])
})

test("no axe violations while it rests where the page stays usable", async ({
  page,
  open,
}) => {
  await open("drawer", { snap: "0.25,0.75", "modal-above": "0.25" })
  await openDrawer(page)
  expect(await audit(page)).toEqual([])
})

test("the drawer's accessibility tree is a dialog with its handle, title and actions", async ({
  page,
  open,
}) => {
  await open("drawer")
  await openDrawer(page)
  await expect(drawerDialog(page)).toMatchAriaSnapshot(`
    - dialog "Move goal":
      - button "Resize"
      - heading "Move goal" [level=2]
      - paragraph: Set your daily activity goal.
      - button "Submit"
      - button "Cancel"
  `)
})

test(
  "the handle is a button that controls the drawer",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("drawer", { snap: "0.25,0.5,1" })
    await drawerTrigger(page).click()
    const id = await drawerDialog(page).getAttribute("id")
    await expect(handle(page)).toHaveAttribute("aria-controls", id!)
  }
)
