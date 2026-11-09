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

// Only the meters' own announcements: what reading their content says varies.
const meters = (log: string[]) => log.filter((phrase) => /^meter,/.test(phrase))

test("announcements while reading meters", async ({ page, open }) => {
  await open("meter", { sr: "" })
  expect(meters(await readThrough(page, 30))).toEqual(
    expect.arrayContaining([
      "meter, Storage, min value 0, max value 100, current value 60%",
      "meter, Requests, min value 0, max value 1000, current value 750 of 1000 requests",
      "meter, Disk, min value 0, max value 512, current value 128 GB",
      "meter, Score, min value 1, max value 5, current value 50%",
    ])
  )
})
