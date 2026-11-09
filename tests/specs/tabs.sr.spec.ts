import type { Page } from "@playwright/test"
import { expect, panelNamed, tabNamed, test } from "../fixtures"

// What a screen reader announces, recorded by a virtual screen reader that
// follows focus and the accessibility tree. Every implementation must say the same.

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

// The fixture's status region and an explicit aria-disabled="false" add phrases
// that say nothing about the tabs.
const withoutNoise = (log: string[]) =>
  log
    .filter((phrase) => !phrase.startsWith("polite:"))
    .map((phrase) => phrase.replace(", not disabled", ""))

// Tabs into the list, walks every tab, then moves into the selected panel and back.
test("announcements while using the tabs with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("tabs", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(tabNamed(page, "Account")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(tabNamed(page, "Password")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(tabNamed(page, "Billing")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(tabNamed(page, "Notifications")).toBeFocused()
    await tab()
    await expect(panelNamed(page, "Notifications")).toBeFocused()
    await tab({ shift: true })
    await expect(tabNamed(page, "Notifications")).toBeFocused()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "tab, Account, selected, 1 control, position 1, set size 4",
    "tab, Password, selected, 1 control, position 2, set size 4",
    "tab, Billing, not selected, disabled, position 3, set size 4",
    "tab, Notifications, selected, 1 control, position 4, set size 4",
    "tabpanel, Notifications",
    "tab, Notifications, selected, 1 control, position 4, set size 4",
  ])
})
