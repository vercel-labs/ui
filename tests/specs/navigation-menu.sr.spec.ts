import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// What a screen reader announces, recorded by a virtual screen reader that
// follows focus and the accessibility tree.

type Virtual = {
  start: (options: { container: Element }) => Promise<void>
  stop: () => Promise<void>
  spokenPhraseLog: () => Promise<string[]>
}

async function record(page: Page, steps: () => Promise<void>) {
  await page.waitForFunction(() => "virtual" in window)
  await page.evaluate(() =>
    (window as unknown as { virtual: Virtual }).virtual.start({
      container: document.body,
    })
  )
  await steps()
  const log = await page.evaluate(() =>
    (window as unknown as { virtual: Virtual }).virtual.spokenPhraseLog()
  )
  await page.evaluate(() =>
    (window as unknown as { virtual: Virtual }).virtual.stop()
  )
  return log
}

test(
  "announcements while opening a panel and tabbing through it",
  { tag: "@enhancement" },
  async ({ page, open, tab }) => {
    await open("navigation-menu", { sr: "" })
    const products = page.getByRole("button", { name: "Products", exact: true })
    const log = await record(page, async () => {
      await page.getByRole("button", { name: "Before" }).focus()
      await tab()
      await expect(products).toBeFocused()
      await page.keyboard.press("Enter")
      await expect(products).toHaveAttribute("aria-expanded", "true")
      await tab()
      await expect(page.getByRole("link", { name: "Analytics" })).toBeFocused()
      await page.keyboard.press("Escape")
      await expect(products).toBeFocused()
    })
    // The fixture's status line reports each change, which isn't the menu's announcement.
    // Focus stays on the trigger as it expands, so the state is read on the way back.
    expect(
      log.filter((phrase) => !phrase.startsWith("polite: Last action"))
    ).toEqual([
      "document",
      "button, Before",
      "button, Products, not expanded",
      "link, Analytics",
      "button, Products, not expanded",
    ])
  }
)
