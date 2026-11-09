import { expect, expectFocus, menuNamed } from "../fixtures"

type Page = import("@playwright/test").Page

const menubar = (page: Page) => page.getByRole("menubar", { name: "Editor" })
const trigger = (page: Page, name: string) =>
  menubar(page).getByRole("menuitem", { name, exact: true })

// Tabs onto the menubar's first trigger.
async function enter(page: Page, tab: () => Promise<void>) {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expectFocus(page, "File")
}

// Waits for a closing menu's exit, so the next press doesn't land on it.
async function closed(page: Page, name: string) {
  await expect(menuNamed(page, name)).toHaveCount(0)
}

export { closed, enter, menubar, trigger }
