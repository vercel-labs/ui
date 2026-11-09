import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { quantity } from "./number-input.helpers"

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

// The fixture's status regions add phrases that say nothing about the fields.
const withoutNoise = (log: string[]) =>
  log.filter((phrase) => !phrase.startsWith("polite:"))

test("announcements while moving to a number input with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("number-input", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(quantity(page)).toBeFocused()
  })
  // Implementations may describe the role in their own words, like "Number input".
  const spoken = withoutNoise(log)
  expect(spoken.slice(0, 2)).toEqual(["document", "button, Before"])
  expect(spoken[2]).toMatch(/, Quantity, 1, Up to 99\.$/)
  expect(spoken).toHaveLength(3)
})
