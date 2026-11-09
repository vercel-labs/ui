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

test("reading a scroll area announces its region and content, and no scrollbar", async ({
  page,
  open,
}) => {
  await open("scroll-area", { sr: "" })
  const log = await readThrough(page, 10)
  // Paragraph boundaries are the fixture's markup, not the scroll area's.
  const spoken = log.filter((phrase) => !/paragraph|^document$/.test(phrase))
  expect(spoken.slice(0, 4)).toEqual([
    "button, Before",
    "region, Tags",
    "Tag 1",
    "Tag 2",
  ])
})
