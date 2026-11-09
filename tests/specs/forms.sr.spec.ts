import type { Page } from "@playwright/test"
import { checkbox, radio } from "./forms.helpers"
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

// The fixture's status regions add phrases that say nothing about the controls.
// The virtual screen reader announces focus moves, not state changes in place.
const withoutNoise = (log: string[]) =>
  log.filter((phrase) => !phrase.startsWith("polite:"))

test("announcements while checking boxes with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("forms", { sr: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(checkbox(page, "Accept the terms")).toBeFocused()
    await page.keyboard.press(" ")
    await expect(checkbox(page, "Accept the terms")).toBeChecked()
    await tab()
    await expect(checkbox(page, "All toppings")).toBeFocused()
    await page.keyboard.press(" ")
    await expect(checkbox(page, "All toppings")).toBeChecked()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "checkbox, Accept the terms, You must accept them to continue., not checked, required",
    "checkbox, All toppings, partially checked, 3 controls",
  ])
})

test("announcements while choosing a radio with a keyboard", async ({
  page,
  open,
}) => {
  await open("forms", { sr: "", plan: "free" })
  const log = await record(page, async () => {
    await radio(page, "Free").focus()
    await expect(radio(page, "Free")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(radio(page, "Pro")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(radio(page, "Enterprise")).toBeFocused()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "radio, Free, checked, position 1, set size 4",
    "radio, Pro, checked, position 2, set size 4",
    "radio, Enterprise, checked, position 4, set size 4",
  ])
})
