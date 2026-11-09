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

// Opens the popover, walks it, and closes it with its close button.
async function walk(
  page: Page,
  tab: (options?: { shift?: boolean }) => Promise<void>
) {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await page.keyboard.press("Enter")
  await expect(
    page.getByRole("textbox", { name: "Display name" })
  ).toBeFocused()
  await tab()
  await expect(page.getByRole("button", { name: "Save" })).toBeFocused()
  await tab()
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("button", { name: "Profile" })).toBeFocused()
}

test("announcements while using the popover with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("popover", { sr: "" })
  const log = await record(page, () => walk(page, tab))
  expect(log).toEqual([
    "document",
    "button, Before",
    "button, Profile, not expanded, has popup dialog",
    "dialog, Edit profile, Your name appears on your posts.",
    "textbox, Display name, Ada",
    "button, Save",
    "button, Close",
    "button, Profile, not expanded, has popup dialog",
  ])
})
