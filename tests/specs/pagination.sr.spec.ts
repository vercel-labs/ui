import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { paginationFixture as f } from "../fixtures/pagination"
import { current, part } from "./pagination.helpers"

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

// The fixture's status regions add phrases that say nothing about the components.
const withoutNoise = (log: string[]) =>
  log
    .filter((phrase) => !phrase.startsWith("polite:"))
    .map((phrase) => phrase.replace(", not disabled", ""))

// Tabs into the pagination, past the disabled steps, onto the current page,
// on to page 2 and presses it.
test("announcements while paging with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("pagination", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(part(page, f.first)).toBeFocused()
    await tab()
    await tab()
    await expect(part(page, 1)).toBeFocused()
    await tab()
    await expect(part(page, 2)).toBeFocused()
    await page.keyboard.press("Enter")
    await expect.poll(() => current(page)).toEqual(["2"])
    await tab({ shift: true })
    await tab()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    // Disabled steps stay in the tab order, so they say why they do nothing.
    `button, ${f.first}, disabled`,
    `button, ${f.previous}, disabled`,
    "button, 1, current page",
    "button, 2",
    "button, 1",
    "button, 2, current page",
  ])
})
