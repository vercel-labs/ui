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
  "announcements while tabbing into the card and out",
  { tag: "@enhancement" },
  async ({ page, open, tab }) => {
    await open("hover-card", { sr: "" })
    const log = await record(page, async () => {
      await page.getByRole("button", { name: "Before" }).focus()
      await tab()
      await expect(
        page.getByRole("link", { name: "View profile" })
      ).toBeVisible()
      await tab()
      await expect(
        page.getByRole("link", { name: "View profile" })
      ).toBeFocused()
      await tab()
      await expect(page.getByRole("button", { name: "After" })).toBeFocused()
    })
    // The fixture's status line reports each change, which isn't the card's announcement.
    expect(
      log.filter((phrase) => !phrase.startsWith("polite: Last action"))
    ).toEqual([
      "document",
      "button, Before",
      "link, @ada",
      "link, View profile",
      "button, After",
    ])
  }
)
