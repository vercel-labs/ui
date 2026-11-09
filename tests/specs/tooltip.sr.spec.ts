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
  "announcements while tabbing through triggers with tooltips",
  { tag: "@enhancement" },
  async ({ page, open, tab }) => {
    await open("tooltip", { sr: "" })
    const log = await record(page, async () => {
      await page.getByRole("button", { name: "Before" }).focus()
      await tab()
      await expect(
        page.getByRole("button", { name: "Save", exact: true })
      ).toBeFocused()
      await tab()
      await expect(page.getByRole("button", { name: "Bold" })).toBeFocused()
      await page.keyboard.press("Escape")
      await expect(page.getByRole("tooltip")).toHaveCount(0)
    })
    const mac = await page.evaluate(() =>
      /Mac|iPhone|iPad/.test(navigator.platform)
    )
    expect(log).toEqual([
      "document",
      "button, Before",
      `button, Save, Save your changes, key shortcuts ${mac ? "Meta" : "Control"}+S`,
      "button, Bold",
    ])
  }
)
