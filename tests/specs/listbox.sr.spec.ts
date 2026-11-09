import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { option } from "./listbox.helpers"

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

// The fixture's status regions add phrases that say nothing about the component.
const withoutNoise = (log: string[]) =>
  log.filter((phrase) => !phrase.startsWith("polite:"))

// Tabs into a single listbox, where the selection follows focus, down over a
// disabled option it skips, and out.
test("announcements while choosing one option with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("listbox", { sr: "", value: "mushroom" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(option(page, "Mushroom")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Onion")).toBeFocused()
    await tab()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "option, Mushroom, selected, position 4, set size 8",
    "option, Onion, selected, position 6, set size 8",
    "button, Submit",
  ])
})

// Tabs into a multiple listbox, toggles an option and extends a range.
test("announcements while choosing several options with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("listbox", { sr: "", multiple: "", grouped: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(option(page, "Basil")).toBeFocused()
    await page.keyboard.press(" ")
    await expect(option(page, "Basil")).toHaveAttribute("aria-selected", "true")
    await page.keyboard.press("Shift+ArrowDown")
    await expect(option(page, "Garlic")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await page.keyboard.press("ArrowDown")
    await expect(option(page, "Mushroom")).toBeFocused()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "option, Basil, not selected, position 1, set size 2",
    "option, Garlic, selected, position 2, set size 2",
    "option, Mushroom, not selected, position 1, set size 3",
  ])
})
