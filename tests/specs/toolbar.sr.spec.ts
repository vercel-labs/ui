import type { Page } from "@playwright/test"
import { expect, expectFocus, test } from "../fixtures"

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

// The fixture's status region adds phrases that say nothing about the toolbar.
const withoutNoise = (log: string[]) =>
  log
    .filter((phrase) => !phrase.startsWith("polite:"))
    .map((phrase) => phrase.replace(", not disabled", ""))

// Tabs into the toolbar, through a toggle group, onto a disabled toggle, into
// the next group, and out again.
test("announcements while moving through the toolbar with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("toolbar", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expectFocus(page, "Bold")
    for (const name of ["Italic", "Underline", "Left"]) {
      await page.keyboard.press("ArrowRight")
      await expectFocus(page, name)
    }
    await tab()
    await expectFocus(page, "After")
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "button, Bold, pressed",
    "button, Italic, not pressed",
    "button, Underline, disabled, not pressed",
    "button, Left, pressed",
    "button, After",
  ])
})
