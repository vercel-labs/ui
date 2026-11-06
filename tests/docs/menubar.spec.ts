import { expect, type Locator } from "@playwright/test"
import { test } from "./docs-test"
import { frameworks, testExamples, type Check } from "./docs-helpers"

// Opens a menubar's first menu by pressing its trigger, checks the menu shows,
// and closes it with Escape.
const opens =
  (trigger: string, item: string): Check =>
  async (preview: Locator) => {
    const page = preview.page()
    await preview.getByRole("menuitem", { name: trigger, exact: true }).first().click()
    await expect(page.getByRole("menu").getByText(item).first()).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("menu")).toHaveCount(0)
  }

testExamples(
  "menubar",
  {
    demo: opens("File", "New Document"),
    submenu: opens("File", "New File"),
    vertical: opens("Inbox", "Open Inbox"),
  },
  undefined,
  ["demo", "checkbox", "radio", "submenu", "icons", "rtl", "vertical"],
)

// A press on another trigger while a menu is open switches menus.
for (const framework of frameworks) {
  test(`pressing another trigger switches menus in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/menubar`)
    await page.waitForLoadState("networkidle")
    const preview = page.locator("[data-example]").first()
    const edit = await preview.getByRole("menuitem", { name: "Edit", exact: true }).boundingBox()
    await preview.getByRole("menuitem", { name: "File", exact: true }).click()
    await expect(page.getByRole("menu").getByText("New Document")).toBeVisible()
    await page.mouse.click(edit!.x + edit!.width / 2, edit!.y + edit!.height / 2)
    await expect(page.getByRole("menu").getByText("Undo")).toBeVisible()
    await expect(page.getByRole("menu").getByText("New Document")).toHaveCount(0)
  })
}
