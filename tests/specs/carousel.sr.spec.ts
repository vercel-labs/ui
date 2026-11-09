import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import {
  expectShown,
  indicator,
  nextButton,
  previousButton,
  slideLink,
} from "./carousel.helpers"

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

// The fixture's status regions add phrases that say nothing about the carousel.
const withoutNoise = (log: string[]) =>
  log.filter((phrase) => !phrase.startsWith("polite: "))

// Tabs into the carousel, where only the slide in view is reachable, pages
// with Next, then walks the indicators, whose tabs control their slides.
test("announcements while using the carousel with a keyboard @enhancement", async ({
  page,
  open,
  tab,
}) => {
  await open("carousel", { sr: "" })
  await expectShown(page, 0)
  const log = await record(page, async () => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(slideLink(page, 0)).toBeFocused()
    await tab()
    await expect(previousButton(page)).toBeFocused()
    await tab()
    await expect(nextButton(page)).toBeFocused()
    await page.keyboard.press("Enter")
    await expectShown(page, 1)
    await tab()
    await expect(indicator(page, 2)).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(indicator(page, 3)).toBeFocused()
    await expectShown(page, 2)
  })
  expect(withoutNoise(log)).toEqual([
    "document",
    "button, Before",
    "link, View desk lamp",
    "button, Previous slide, 1 control, disabled",
    "button, Next slide, 1 control",
    "tab, Slide 2, selected, 1 control, position 2, set size 5",
    "tab, Slide 3, selected, 1 control, position 3, set size 5",
  ])
})
