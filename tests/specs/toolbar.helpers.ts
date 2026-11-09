import { expect, expectFocus, focusedName } from "../fixtures"
import { toolbarItems } from "../fixtures/toolbar"

type Page = import("@playwright/test").Page

const toolbar = (page: Page) =>
  page.getByRole("toolbar", { name: "Formatting" })

// Tabs into the toolbar and walks to an item with ArrowRight. A field may keep
// the first arrow for its caret, so a second one leaves it.
async function walkTo(page: Page, tab: () => Promise<void>, name: string) {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expectFocus(page, toolbarItems[0])
  for (const [index, item] of toolbarItems
    .slice(1, toolbarItems.indexOf(name) + 1)
    .entries()) {
    await page.keyboard.press("ArrowRight")
    const previous = toolbarItems[index]
    if (previous === "Font size" || previous === "Comment") {
      if ((await focusedName(page)) === previous) {
        await page.keyboard.press("ArrowRight")
      }
    }
    await expectFocus(page, item)
  }
}

export { expect, toolbar, walkTo }
