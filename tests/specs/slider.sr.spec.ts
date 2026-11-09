import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { minimum, volume } from "./slider.helpers"

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

// The fixture's status regions add phrases that say nothing about the sliders.
const withoutNoise = (log: string[]) =>
  log.filter((phrase) => !phrase.startsWith("polite:"))

test("announcements while moving to a slider with a keyboard", async ({
  page,
  open,
  tab,
}) => {
  await open("slider", { sr: "", percent: "" })
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(volume(page)).toBeFocused()
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "slider, Volume, How loud the room is., orientated horizontally, max value 100, min value 0, current value 50%",
  ])
})

// Each thumb announces the range it can move in, so a screen reader can tell
// how far it can go.
test(
  "a range thumb announces how far it can go and its formatted value",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("slider", { sr: "", currency: "" })
    const log = await record(page, async () => {
      await minimum(page).focus()
      await expect(minimum(page)).toBeFocused()
    })
    expect(withoutNoise(log)).toEqual([
      "document",
      "slider, Minimum price, orientated horizontally, max value 80, min value 0, current value €20.00",
    ])
  }
)
