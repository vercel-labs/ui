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

test("announcements while choosing with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("select", { sr: "" })
  const trigger = page.getByRole("combobox", { name: "Fruit" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(trigger).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("option", { name: "Apple" })).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("option", { name: "Banana" })).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(trigger).toBeFocused()
  })
  // The fixture's own status regions aren't part of the contract.
  expect(
    log.filter((phrase) => !/^polite: (Last action|Submitted)/.test(phrase))
  ).toEqual([
    "document",
    "button, Before",
    "combobox, Fruit, has popup listbox, not expanded",
    "option, Apple, not selected, position 1, set size 8",
    "option, Banana, not selected, position 2, set size 8",
    "combobox, Fruit, has popup listbox, not expanded",
  ])
})
