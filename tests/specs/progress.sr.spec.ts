import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// What a screen reader announces, recorded by a virtual screen reader that
// follows the accessibility tree. Every implementation must say the same.

type Virtual = {
  start: (options: { container: Element }) => Promise<void>
  stop: () => Promise<void>
  next: () => Promise<void>
  spokenPhraseLog: () => Promise<string[]>
}

// Reads the fixture from the top, one item at a time.
async function readThrough(page: Page, steps: number) {
  await page.waitForFunction(() => "virtual" in window)
  return page.evaluate(async (steps) => {
    const virtual = (window as unknown as { virtual: Virtual }).virtual
    await virtual.start({ container: document.querySelector(".fixture")! })
    for (let step = 0; step < steps; step++) {
      await virtual.next()
    }
    const log = await virtual.spokenPhraseLog()
    await virtual.stop()
    return log
  }, steps)
}

// Only the bars' own announcements: what reading their content says varies.
const bars = (log: string[]) =>
  log.filter((phrase) => /^progressbar,/.test(phrase))

test("announcements while reading progress bars", async ({ page, open }) => {
  await open("progress", { sr: "" })
  expect(bars(await readThrough(page, 24))).toEqual(
    expect.arrayContaining([
      "progressbar, Uploading, max value 100, min value 0, current value 40%",
      "progressbar, Files, max value 12, min value 0, current value 3 of 12 files",
    ])
  )
})

// Screen readers say a bar without a value is busy in the user's language.
test("an indeterminate bar announces no words of its own @enhancement", async ({
  page,
  open,
}) => {
  await open("progress", { sr: "" })
  expect(bars(await readThrough(page, 12))).toContain(
    "progressbar, Loading, max value 100, min value 0"
  )
})
