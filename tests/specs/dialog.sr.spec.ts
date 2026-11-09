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

// The trigger has no aria-expanded, so it never reads as "collapsed" once the
// dialog closes.
test(
  "announcements while using the dialog with a keyboard",
  { tag: "@enhancement" },
  async ({ page, open, tab }) => {
    await open("dialog", { sr: "" })
    const log = await record(page, async () => {
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
      await expect(
        page.getByRole("button", { name: "Edit profile" })
      ).toBeFocused()
    })
    expect(log).toEqual([
      "document",
      "button, Before",
      "button, Edit profile, has popup dialog",
      "dialog, Profile settings, Make changes to your profile., modal",
      "textbox, Display name, Ada",
      "button, Save",
      "button, Close",
      "button, Edit profile, has popup dialog",
    ])
  }
)

test("announcements while using the alert dialog with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("dialog", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Delete project" }).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused()
    await tab()
    await expect(
      page.getByRole("button", { name: "Delete", exact: true })
    ).toBeFocused()
    await tab({ shift: true })
    await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(
      page.getByRole("button", { name: "Delete project" })
    ).toBeFocused()
  })
  // Only what the dialog itself says is the contract. How the trigger reads
  // depends on whether it sets aria-expanded.
  // An alert dialog is assertive, so changes inside it may also be read out. Only focus moves count here.
  const moves = log.filter((line) => !/^(assertive|polite):/.test(line))
  const start = moves.findIndex((line) => line.startsWith("alertdialog"))
  expect(moves.slice(start, -1)).toEqual([
    expect.stringMatching(
      /^alertdialog, Delete project\?, This permanently deletes the project and its files\./
    ),
    "button, Cancel",
    "button, Delete",
    "button, Cancel",
  ])
})
