import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

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

// Opens the menu, walks it, enters and leaves a submenu, then closes it.
async function walk(page: Page, tab: () => Promise<void>) {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("ArrowDown")
  }
  await page.keyboard.press("ArrowDown")
  await expect(
    page.getByRole("menuitemcheckbox", { name: "Show status bar" })
  ).toBeFocused()
  await page.keyboard.type("sha")
  await expect(page.getByRole("menuitem", { name: "Share" })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(page.getByRole("menuitem", { name: "Email" })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("menuitem", { name: "Share" })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("button", { name: "File" })).toBeFocused()
}

const withoutShortcuts = (log: string[]) =>
  log.map((phrase) => phrase.replace(/, key shortcuts [^,]+/, ""))

test("announcements while using the menu with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("menu", { sr: "" })
  const log = await record(page, () => walk(page, tab))
  expect(withoutShortcuts(log)).toEqual([
    "document",
    "button, Before",
    "button, File, not expanded, has popup menu",
    "menuitem, New file, position 1, set size 5",
    "menuitem, Open…, position 2, set size 5",
    "menuitem, Save, disabled, position 3, set size 5",
    "menuitemcheckbox, Show sidebar, checked, position 1, set size 2",
    "menuitemcheckbox, Show status bar, not checked, position 2, set size 2",
    "menuitemradio, Size, not checked, position 3, set size 3",
    "menuitem, Share, not expanded, has popup menu, position 4, set size 5",
    "menuitem, Email, position 1, set size 3",
    "menuitem, Share, not expanded, has popup menu, position 4, set size 5",
    "button, File, not expanded, has popup menu",
  ])
})

test(
  "item shortcuts are announced",
  { tag: "@enhancement" },
  async ({ page, open, tab }) => {
    await open("menu", { sr: "" })
    const log = await record(page, () => walk(page, tab))
    expect(log).toContainEqual(
      expect.stringMatching(
        /^menuitem, New file, key shortcuts (Meta|Control)\+N,/
      )
    )
  }
)
