import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { browse, drop, png, txt, zone } from "./file-input.helpers"

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

// The fixture's status outputs announce themselves too, which says nothing about the file input.
const withoutFixture = (log: string[]) =>
  log.filter(
    (phrase) =>
      !phrase.startsWith("polite:") ||
      / files? (accepted|rejected)/.test(phrase)
  )

test("announcements while reaching a file input and dropping files", async ({
  page,
  open,
  tab,
}) => {
  await open("file-input", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(browse(page)).toBeFocused()
    await drop(zone(page), [png, txt])
    await expect
      .poll(
        async () => (await page.evaluate(() => document.body.textContent)) ?? ""
      )
      .toContain("1 file accepted. 1 file rejected.")
  })
  expect(withoutFixture(log)).toEqual([
    "document",
    "button, Before",
    "button, Attachments Browse files, Images or PDFs, up to 1 KB.",
    "polite: 1 file accepted. 1 file rejected.",
  ])
})
